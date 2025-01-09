import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";
import { getEmbeddings } from "./embedding";
import { db } from "./db";
import { chats } from "./db/schema";


export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileKey: string
) {
  try {
    const client = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });

    const index = await client.index("safetrain");

    const namespaceName = convertToAscii(fileKey);
    const namespace = index.namespace(convertToAscii(fileKey));

    const stats = await index.describeIndexStats();

    if (!stats.namespaces) {
      console.log(`[ERROR]: No namespaces found in the index.`);
      return [];
    }

    const namespaceStats = stats.namespaces[convertToAscii(fileKey)];
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
  const queryEmbeddings = await getEmbeddings(query);

  const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);

  //console.log("[MATCHES] : ", matches)

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


export async function getAllContext(query: string) {
  const queryEmbeddings = await getEmbeddings(query);

  const fileKeys = await db.select({ fileKey: chats.fileKey }).from(chats);

  console.log("[INFO]: File keys to query:", fileKeys);

  const matches = await Promise.all(
    fileKeys.map(({ fileKey }: { fileKey: string }) => getMatchesFromEmbeddings(queryEmbeddings, fileKey))
  )

  
  const flattenMatches = matches.flat();
  flattenMatches.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  const filteredResults = flattenMatches.filter((match) =>  match.score !== undefined && match.score >= 0.75);
  //console.log("[MATCHES CONTENT]:", matches);
  //console.log("[ALL MATCHES BEFORE FILTERING]:", flattenMatches);
  console.log("[FILTERED RESULTS]:", filteredResults);

  const topN = 5;
  const topResults = filteredResults.slice(0, topN);

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

