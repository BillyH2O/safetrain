import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import {Document, RecursiveCharacterTextSplitter} from "@pinecone-database/doc-splitter";
import { downloadFromS3 } from "./s3-server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import md5 from "md5";
import { getEmbeddings } from "./embedding";
import { convertToAscii, removeDiacritics } from "./utils";
import winkBM25 from "wink-bm25-text-search";
import { uploadBufferToS3 } from "./s3";

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

type PDFPage = {
    pageContent: string;
    metadata: {
        loc: {pageNumber:number}
    }
}

export async function loadS3IntoPinecone(fileKey: string, embeddingModel: string, chunkingMethod: string, isHybridResearch: boolean = true) {
  let chunkSize: number, chunkOverlap: number, namespaceSuffix: string;
  if (chunkingMethod === "late_chunking") {
    // Par exemple, plus gros chunks pour la méthode Late Chunking
    chunkSize = 1500;
    chunkOverlap = 200;
    namespaceSuffix = "late_chunking";
  } else {
    // Paramètres par défaut pour le standard
    chunkSize = 300;
    chunkOverlap = 20;
    namespaceSuffix = "standard";
  } 
  
  console.log("downloading s3 into file system");
  const file_name = await downloadFromS3(fileKey);
  if (!file_name) {
    throw new Error("could not download from s3");
  }
  console.log("loading pdf into memory" + file_name);
  const loader = new PDFLoader(file_name);
  const pages = (await loader.load()) as PDFPage[];
  console.log("Nombre de pages chargés :", pages.flat().length);

  // 2. split & segmenter le pdf
  const documents = await Promise.all(pages.map(page => prepareDocument(page, chunkSize, chunkOverlap)));
  const flattenedDocs = documents.flat();
  
  console.log("Nombre de documents découpés :", flattenedDocs.length);
  
  // 3. vectorisation d'un doc
  const vectors = await Promise.all(flattenedDocs.map(document => embedDocument(document, fileKey, embeddingModel)));
  console.log("Nombre de vecteurs générés :", vectors.length);

  console.log("isHybridResearch : ", isHybridResearch)
  if (isHybridResearch) {  
    await handleBM25Index(fileKey, namespaceSuffix, flattenedDocs);
  }
  // 4. upload pinecone
  const pineconeIndex = await pc.index("safetrain");
  const namespace = pineconeIndex.namespace(`${convertToAscii(fileKey)}_${namespaceSuffix}`);

  console.log("inserting vectors into pinecone");
  await namespace.upsert(vectors);

  return documents[0];
}

async function embedDocument(doc: Document, fileKey: string, embeddingModel: string) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent, embeddingModel);

    // Génère un hash unique basé sur le contenu du texte. Cela permet de donner un ID unique au vecteur, basé sur le texte lui-même (=> pas de doublon)
    const hash = md5(doc.pageContent); 

    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
        fileName: fileKey,
        
      },
    } as PineconeRecord;
  } catch (error) {
    console.log("error embedding document", error);
    throw error;
  }
}

export const truncateStringByBytes = (str: string, bytes: number) => {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};

async function prepareDocument(page: PDFPage, chunkSize: number, chunkOverlap: number) {
  let { pageContent } = page;
  const metadata = page.metadata;
  pageContent = pageContent.replace(/\n/g, "");
  
  // Split the docs
  const splitter = new RecursiveCharacterTextSplitter({ chunkSize, chunkOverlap });
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 35000),
      },
    }),
  ]);
  return docs;
}

export async function deleteNamespace(fileKey: string){
  const pineconeIndex = await pc.index("safetrain");
  const namespaces = [
    `${convertToAscii(fileKey)}_standard`,
    `${convertToAscii(fileKey)}_late_chunking`,
  ];

  const stats_before = await pineconeIndex.describeIndexStats();
  const totalBefore = stats_before.totalRecordCount ?? 0; 

  for (const ns of namespaces) {
    console.log(`Suppression du namespace "${ns}"...`);
    await pineconeIndex.namespace(ns).deleteAll();
  }

  const stats_after = await pineconeIndex.describeIndexStats();
  const totalAfter = stats_after.totalRecordCount ?? 0;
  
  if(totalBefore > totalAfter){
    console.log(`Les namespaces ${namespaces.join(" et ")} ont été supprimés.`);
  }
  else{
    console.error(`Echec de la suppression du namespace ${fileKey}.`)
  }
}

export async function deletePineconeNamespaces(fileKey: string): Promise<void> {
  try {
    const pineconeIndex = await pc.index("safetrain");
    
    const namespaces = [
      `${convertToAscii(fileKey)}_standard`,
      `${convertToAscii(fileKey)}_late_chunking`,
    ];
    
    for (const ns of namespaces) {
      console.log(`Suppression du namespace "${ns}"...`);
      try {
        await pineconeIndex.namespace(ns).deleteAll();
        console.log(`Namespace "${ns}" supprimé avec succès.`);
      } catch (error: any) {
        if (error.message.includes("not found")) {
          console.warn(`Namespace "${ns}" non trouvé. Peut-être déjà supprimé.`);
        } else {
          console.error(`Erreur lors de la suppression du namespace "${ns}" :`, error);
          throw error; // Propager l'erreur pour gérer dans la route API
        }
      }
    }

    console.log(`Les namespaces ${namespaces.join(" et ")} ont été traités.`);
  } catch (error) {
    console.error("Erreur lors de la suppression des namespaces Pinecone :", error);
    throw error;
  }
}

async function handleBM25Index(fileKey: string, namespaceSuffix: string, documents: Document[]) {
  try {
    const bm25 = winkBM25();
    bm25.defineConfig({fldWeights: {body: 1}}); // structure donnée à winkBM25
    bm25.definePrepTasks([
      function (text: string): string[] {
        // Nettoyage minimal : convertir en minuscules et splitter par espaces
        const noAccents = removeDiacritics(text.toLowerCase());
        return noAccents.split(/\s+/);
      }
    ]);
    console.log("Adding documents to BM25 index...");

    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i];
      bm25.addDoc({ body: doc.pageContent }, i);
    }
    bm25.consolidate(); // Consolidation de l'index (obligatoire pour finaliser)
    const exportedIndex = bm25.exportJSON(); // Exportation de l'index en JSON
    //console.log("[BM25 INDEX]: ", exportedIndex);
    console.log("Saving BM25 index to S3...");
    const indexBuffer = Buffer.from(JSON.stringify(exportedIndex));
    //console.log("JSON.stringify(engine.getIndex()) : ", JSON.stringify(exportedIndex));
    await uploadBufferToS3(indexBuffer, `${fileKey}_${namespaceSuffix}_bm25.json`);
    console.log("BM25 index saved to S3");
    const docContents = documents.map(d => d.pageContent);
    const docsBuffer = Buffer.from(JSON.stringify(docContents));
    await uploadBufferToS3(docsBuffer, `${fileKey}_${namespaceSuffix}_bm25_docs.json`);
    console.log("BM25 doc saved to S3");
  } catch (error) {
    console.error("Erreur lors de la gestion de l'index BM25 :", error);
    throw error;
  }
}

/*async function prepareDocumentForLateChunking(page: PDFPage) {
  let { pageContent, metadata } = page;
  pageContent = pageContent.replace(/\n/g, "");
  // split the docs
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1500, // ou 2000, à ajuster
    chunkOverlap: 200,
  });
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 35000),
      },
    }),
  ]);
  return docs;
}*/