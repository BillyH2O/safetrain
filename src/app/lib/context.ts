import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";
import { getEmbeddings } from "./embedding";
import { db } from "./db";
import { chats } from "./db/schema";
import { Document, RecursiveCharacterTextSplitter } from "@pinecone-database/doc-splitter";
import { ScoredVector } from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data";

type Metadata = {
  text: string;
  pageNumber?: number;
  [key: string]: any;
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

export async function getContext(query: string, fileKey: string) {
  const chunkingMethod = "standard";

  const queryEmbeddings = await getEmbeddings(query);

  const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey, chunkingMethod);

  console.log("[MATCHES] : ", matches)

  const qualifyingDocs = matches.filter(
    (match) => match.score && match.score > 0.7
  );

  type Metadata = {
    text: string;
    pageNumber: number;
  };

  let docs = qualifyingDocs.map((match) => (match.metadata as Metadata).text);
  // 5 vectors
  return docs.join("\n").substring(0, 3000);
}


export async function getAllContext(query: string, chunkingMethod: string) {
  
  console.log("HUNCKING METHODE ALL : ", chunkingMethod)
  const queryEmbeddings = await getEmbeddings(query);
  const fileKeys = await db.select({ fileKey: chats.fileKey }).from(chats);
  const matches = await Promise.all(
    fileKeys.map(({ fileKey }: { fileKey: string }) => getMatchesFromEmbeddings(queryEmbeddings, fileKey, chunkingMethod))
  )
  const flattenMatches = matches.flat();
  flattenMatches.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  const filteredResults = flattenMatches.filter((match) =>  match.score !== undefined && match.score >= 0.75);
  const topN = 5;
  const topResults = filteredResults.slice(0, topN);

  console.log("[INFO]: File keys to query:", fileKeys);
  //console.log("[MATCHES CONTENT]:", matches);
  //console.log("[ALL MATCHES BEFORE FILTERING]:", flattenMatches);
  //console.log("[FILTERED RESULTS]:", filteredResults);
  console.log("[topResults]:", topResults);

  return topResults
  .map((match) => {
     const docName = match.metadata?.fileName ?? "UnnamedDoc";
     const snippet = match.metadata?.text ?? "";
     return `DOCUMENT: ${docName}\n${snippet}`;
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

function cosineSimilarity(a: number[], b: number[]): number {
  // a et b : vecteurs de même taille
  let dot = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function getContextLateChunking(query: string, fileKey: string, topK = 10): Promise<string> {
  const chunkingMethod = "late_chunking"
  
  // 1. Embeddings sur la query
  const queryEmbeddings = await getEmbeddings(query);

  // 2. Récupérer topK "gros" chunks depuis Pinecone
  const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey, chunkingMethod);
  if (!matches || matches.length === 0) {
    console.log("[INFO]: Aucun match trouvé pour cette requête.");
    return "";
  }
  // 3. Pour chaque match (gros chunk), on va redécouper localement + scorer
  const topMatches = matches.slice(0, topK);
  const refinedPassagesArrays = await Promise.all(
    topMatches.map((match) => prepareLateChunk(match, queryEmbeddings))
  );
    /* OU
  let allRefinedPassages: Array<{ text: string; score: number }> = []; 
  for (const match of matches) {
  const refinedPassages = await prepareLateChunk(match, queryEmbeddings);
  allRefinedPassages = allRefinedPassages.concat(refinedPassages);
} */ 
  const allRefinedPassages = refinedPassagesArrays.flat();

  // Étape 4 : On trie par score décroissant
  allRefinedPassages.sort((a, b) => b.score - a.score);

  // Étape 5 : Sélection des meilleurs sous-chunks (topN)
  const topSubChunks = allRefinedPassages.slice(0, 5).map((p) => p.text);

  console.log("[MATCHES LATE CHUNKING] : ", matches)
  console.log("[topMatches LATE CHUNKING] : ", topMatches)
  console.log("[topSubChunks LATE CHUNKING] : ", topSubChunks)
  // On reconstitue le contexte final en limitant à 3000 caractères max
  const finalContext = topSubChunks.join("\n\n");
  return finalContext.substring(0, 3000);
}
