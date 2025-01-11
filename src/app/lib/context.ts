import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii, cosineSimilarity } from "./utils";
import { getEmbeddings } from "./embedding";
import { db } from "./db";
import { chats } from "./db/schema";
import { Document, RecursiveCharacterTextSplitter } from "@pinecone-database/doc-splitter";
import { ScoredVector } from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data";
import { applyReranking, reRankWithGPT, reRankWithHuggingFace } from "./reranking";

export type Metadata = {
  text: string;
  pageNumber?: number;
  [key: string]: any;
};

export type RerankedDoc = {
  text: string;
  newScore: number;
};

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileKey: string,
  chunkingMethod: string
) {
  try {
    const client = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });

    console.log("CHUNKING METHOD : ", chunkingMethod)

    const index = await client.index("safetrain");

    const namespaceName = `${convertToAscii(fileKey)}_${chunkingMethod}`;
    console.log("[namespaceName] : ", namespaceName);
    const namespace = index.namespace(namespaceName);

    const stats = await index.describeIndexStats();

    if (!stats.namespaces) {
      console.log(`[ERROR]: No namespaces found in the index.`);
      return [];
    }

    const namespaceStats = stats.namespaces[namespaceName];
    if (!namespaceStats) {
      console.log(`[INFO]: No records found for namespace "${fileKey}"`);
      return [];
    }

    console.log(`[DOCUMENTS IN NAMESPACE "${fileKey}"]:`, namespaceStats);
    //console.log(`[DOCUMENTS IN NAMESPACE "${fileKey}"]:`, stats);

    const queryResult = await namespace.query({
      topK: 10,
      vector: embeddings,
      includeMetadata: true,    
    });

    return queryResult.matches || [];
  } catch (error) {
    console.log("error querying embeddings", error);
    throw error;
  }
}



export async function getContext(query: string, fileKey: string, rerankingStrategy: string) {
  const chunkingMethod = "standard";
  console.log("reranking STRAT : ", rerankingStrategy);
  const queryEmbeddings = await getEmbeddings(query);
  const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey, chunkingMethod);
  console.log("[MATCHES] : ", matches)
  const filteredResults = matches.filter((match) => match.score && match.score > 0.7);
  const qualifyingDocs = filteredResults.map((match) => ({
    text: (match.metadata as Metadata).text,
    score: match.score ?? 0,
  }));
  const finalDocs = await applyReranking(query, qualifyingDocs, rerankingStrategy);
  const topDocs = finalDocs.slice(0, 5).map((doc) => doc.text);
  return topDocs.join("\n").substring(0, 3000);
}



export async function getContextLateChunking(query: string, fileKey: string, topK = 10, rerankingStrategy: string): Promise<string> {
  const chunkingMethod = "late_chunking"
  const queryEmbeddings = await getEmbeddings(query);
  const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey, chunkingMethod);
  if (!matches || matches.length === 0) {
    console.log("[INFO]: Aucun match trouvé pour cette requête.");
    return "";
  }
  // Pour chaque match (gros chunk), on va redécouper localement + scorer
  const topMatches = matches.slice(0, topK);
  const refinedPassagesArrays = await Promise.all(
    topMatches.map((match) => prepareLateChunk(match, queryEmbeddings))
  );
  const allRefinedPassages = refinedPassagesArrays.flat();
  const filteredResults = allRefinedPassages.filter((p) => p.score > 0.7);
  const finalDocs = await applyReranking(query, filteredResults, rerankingStrategy);
  const topDocs = finalDocs.slice(0, 5).map((p) => p.text); // (topN)
  return topDocs.join("\n").substring(0, 3000);

  //console.log("[MATCHES LATE CHUNKING] : ", matches)
  //console.log("[topMatches LATE CHUNKING] : ", topMatches)
  //console.log("[topSubChunks LATE CHUNKING] : ", topSubChunks)
  // On reconstitue le contexte final en limitant à 3000 caractères max
}

export async function getAllContext(query: string, chunkingMethod: string, rerankingStrategy: string) {
  const queryEmbeddings = await getEmbeddings(query);
  const fileKeys = await db.select({ fileKey: chats.fileKey }).from(chats);
  const matches = await Promise.all(
    fileKeys.map(({ fileKey }: { fileKey: string }) => getMatchesFromEmbeddings(queryEmbeddings, fileKey, chunkingMethod))
  )
  const allMatches  = matches.flat();
  allMatches .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  const filteredResults = allMatches .filter((match) =>  match.score !== undefined && match.score >= 0.75);
  const qualifyingDocs = filteredResults.map((match) => ({
    text: (match.metadata as Metadata).text,
    score: match.score ?? 0,
  }));
  const finalDocs = await applyReranking(query, qualifyingDocs, rerankingStrategy);
  
  const topDocs  = finalDocs.slice(0, 5); // topN

  console.log("[INFO]: File keys to query:", fileKeys);
  //console.log("[MATCHES CONTENT]:", matches);
  //console.log("[ALL MATCHES BEFORE FILTERING]:", allMatches);
  //console.log("[FILTERED RESULTS]:", filteredResults);
  console.log("[topResults]:", topDocs);

  return topDocs 
  .map((doc) => {
    const foundMatch = allMatches.find(
      (m) => (m.metadata as Metadata)?.text === doc.text // on férifie que le match d’origine correspond à doc (un des documents du topDoc).
    );
    const docName = foundMatch?.metadata?.fileName ?? "UnnamedDoc";
    return `DOCUMENT: ${docName}\n${doc.text}`;
  })
  .join("\n")
  .substring(0, 6000);
}


async function splitTextForLateChunking(text: string): Promise<Document[]> {
  // Paramètres ajustables
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 300,   // taille des sous-chunks
    chunkOverlap: 50, // overlap
  });

  const docs = await splitter.splitDocuments([
    new Document({
      pageContent: text,
      metadata: {},
    }),
  ]);
  return docs;
}

async function prepareLateChunk(match: ScoredVector, queryEmbeddings: number[]) {
  const refinedPassages: Array<{
    text: string;
    score: number;
  }> = [];

  // On s'assure que "text" est bien une string
  const text = (match.metadata as Metadata)?.text || "";
  if (typeof text !== "string") {
    console.warn(`Le champ 'text' n'est pas une chaîne pour le match ID: ${match.id}`);
    return refinedPassages;
  }

  // 1. Redécoupe en sous-chunks
  const subDocs = await splitTextForLateChunking(text);

  // 2. Calcule le score de similarité cosinus pour chaque sous-chunk
  for (const subDoc of subDocs) {
    const subEmb = await getEmbeddings(subDoc.pageContent);
    const score = cosineSimilarity(queryEmbeddings, subEmb);
    refinedPassages.push({
      text: subDoc.pageContent,
      score,
    });
  }

  return refinedPassages;
}