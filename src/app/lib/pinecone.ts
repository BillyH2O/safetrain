import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import {Document, RecursiveCharacterTextSplitter} from "@pinecone-database/doc-splitter";
import { downloadFromS3 } from "./s3-server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import md5 from "md5";
import { getEmbeddings } from "./embedding";
import { convertToAscii } from "./utils";

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

type PDFPage = {
    pageContent: string;
    metadata: {
        loc: {pageNumber:number}
    }
}

export async function loadS3IntoPinecone(fileKey: string, chunkingMethod: string) {
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

  // 2. split and segment the pdf
  const documents = await Promise.all(pages.map(page => prepareDocument(page, chunkSize, chunkOverlap)));
  console.log("Nombre de documents découpés :", documents.flat().length);
  
  // 3. vectorise and embed individual documents
  const vectors = await Promise.all(documents.flat().map(document => embedDocument(document, fileKey)));
  console.log("Nombre de vecteurs générés :", vectors.length);
  // 4. upload to pinecone
  const pineconeIndex = await pc.index("safetrain");
  const namespace = pineconeIndex.namespace(`${convertToAscii(fileKey)}_${namespaceSuffix}`);

  console.log("inserting vectors into pinecone");
  await namespace.upsert(vectors);

  return documents[0];
}

async function embedDocument(doc: Document, fileKey: string) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);

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
  let { pageContent, metadata } = page;
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
  const stats_before = await pineconeIndex.describeIndexStats();
  const totalBefore = stats_before.totalRecordCount ?? 0; 
  await pineconeIndex.namespace(convertToAscii(fileKey)).deleteAll();
  const stats_after = await pineconeIndex.describeIndexStats();
  const totalAfter = stats_after.totalRecordCount ?? 0;
  
  if(totalBefore > totalAfter){
    console.log(`Le namespace ${fileKey} a été supprimé.`)
  }
  else{
    console.error(`Echec de la suppression du namespace ${fileKey}.`)
  }
}

async function prepareDocumentForLateChunking(page: PDFPage) {
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
}


