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

export async function loadS3IntoPinecone(fileKey: string) {
    console.log("downloading s3 into file system");
  const file_name = await downloadFromS3(fileKey);
  if (!file_name) {
    throw new Error("could not download from s3");
  }
  console.log("loading pdf into memory" + file_name);
  const loader = new PDFLoader(file_name);
  const pages = (await loader.load()) as PDFPage[];

  // 2. split and segment the pdf
  const documents = await Promise.all(pages.map(prepareDocument));

  // 3. vectorise and embed individual documents
  const vectors = await Promise.all(documents.flat().map(document => embedDocument(document, fileKey)));

  // 4. upload to pinecone
  const pineconeIndex = await pc.index("safetrain");
  const namespace = pineconeIndex.namespace(convertToAscii(fileKey));

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

async function prepareDocument(page: PDFPage) {
  let { pageContent, metadata } = page;
  pageContent = pageContent.replace(/\n/g, "");
  // split the docs
  const splitter = new RecursiveCharacterTextSplitter({chunkSize: 300, chunkOverlap: 20});
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
