import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";


const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

type PDFPage = {
    pageContent: string;
    metadata: {
        loc: {pageNumber:number}
    }
}

export async function loadS3IntoPinecone(fileKey: string) {
    console.log("downloading s3 into file system");
  
    let file_name;
    try {
      file_name = await downloadFromS3(fileKey);
    } catch (error) {
      console.error("Erreur lors du téléchargement depuis S3 :", error);
      throw new Error("Impossible de télécharger le fichier depuis S3.");
    }
  
    if (!file_name || typeof file_name !== "string") {
      throw new Error("Nom de fichier invalide téléchargé depuis S3.");
    }
  
    const loader = new PDFLoader(file_name);
    const pages = (await loader.load()) as PDFPage[]; // Utilisation de await ici
    return pages;
  }