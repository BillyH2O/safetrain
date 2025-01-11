import { OpenAIApi, Configuration } from "openai-edge";
import { Metadata, RerankedDoc } from "./context";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

// On fait un prompt du type : "Score the relevance of the following document
// to the query on a scale from 0 to 1. Query: '...' Document: '...' "
export async function reRankWithGPT(query: string, doc: string): Promise<number> {
  const systemPrompt = `
    Vous êtes un assistant utile qui évalue la pertinence d’un document par rapport à une requête.
    Votre réponse doit être un simple flottant entre 0 et 1, avec 0 = non pertinent, 1 = très pertinent.

    Query: ${query}
    Document: ${doc}

    Veuillez renvoyer uniquement le flottant (0 à 1).
  `;

  // Appel en mode "chat" (ChatGPT style)
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo", // ou autre
    messages: [
      { role: "system", content: systemPrompt },
      // { role: "user", content: "Rate the relevance?" } // parfois besoin d'un user message
    ],
    temperature: 0,
    max_tokens: 5,
  });

  const json = await response.json();
  const content = json.choices?.[0]?.message?.content?.trim();
  
  // Parse le float
  let score = parseFloat(content || "0");
  if (isNaN(score)) {
    score = 0; 
  }
  return score;
}

export async function reRankWithHuggingFace(query: string, doc: string): Promise<number> {
  // Construire le prompt similaire à celui fourni pour GPT
  const prompt = `
    Vous êtes un assistant utile qui évalue la pertinence d’un document par rapport à une requête.
    Votre réponse doit être un simple flottant entre 0 et 1, avec 0 = non pertinent, 1 = très pertinent.

    Query: ${query}
    Document: ${doc}

    Veuillez renvoyer uniquement le flottant (0 à 1).
  `;

  const modelId = "google/flan-t5-small"; // Choisissez le modèle adapté
  const url = `https://api-inference.huggingface.co/models/${modelId}`;

  // Appel à l'API Inference de Hugging Face
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: { max_new_tokens: 5, temperature: 0 },
    }),
  });

  const json = await response.json();

  // Selon le modèle et le endpoint, la réponse est généralement un tableau
  // du type [ { generated_text: "0.75" } ]
  let score = 0;
  if (Array.isArray(json) && json.length > 0) {
    const resultText = json[0].generated_text?.trim();
    score = parseFloat(resultText || "0");
    if (isNaN(score)) {
      score = 0;
    }
  }
  return score;
}


export async function reranking(query: string, qualifyingDocs: any[],rerankingStrategie: string): Promise<RerankedDoc[]> {
    const rerankedDocs = await Promise.all(
      qualifyingDocs.map(async (match) => {
        const text = (match.metadata as Metadata).text;
        let newScore: number;
  
        switch (rerankingStrategie) {
          case "GPT":
            newScore = await reRankWithGPT(query, text);
            console.log("newScore GPT : ", newScore);
            break;
          case "Huggingface":
            newScore = await reRankWithHuggingFace(query, text);
            break;
          default:
            console.log("[RERANKING] : Aucun modèle n'a été sélectionné")
            newScore = 0;
            break;
        }
        return { text, newScore };
      })
    );
    const finalDocs = rerankedDocs.sort((a, b) => b.newScore - a.newScore);
    console.log("[RERANKING] finalDocs : ", finalDocs);
    return finalDocs
  }

export async function applyReranking(query: string, qualifyingDocs: Array<{ text: string; score: number }>, rerankingStrategy: string): Promise<RerankedDoc[]> {
  if (rerankingStrategy != "null") {
    const docsForReranking = qualifyingDocs.map((p) => ({
      metadata: { text: p.text },
    }));
    return await reranking(query, docsForReranking, rerankingStrategy);
  } else { // Pas de reranking => on se contente du score local cosinus
    const finalDocs = qualifyingDocs.map((p) => ({text: p.text, newScore: p.score,}));
    return finalDocs.sort((a, b) => b.newScore - a.newScore); // Tri décroissant par newScore
  }
}
  