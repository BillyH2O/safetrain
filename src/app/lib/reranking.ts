import { OpenAIApi, Configuration } from "openai-edge";
import { Metadata } from "./context";

export type RerankedDoc = {
  text: string;
  newScore: number;
  fileName?: string;
};

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

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
  const prompt = `
    Vous êtes un assistant utile qui évalue la pertinence d’un document par rapport à une requête.
    Votre réponse doit être un simple flottant entre 0 et 1, avec 0 = non pertinent, 1 = très pertinent.

    Query: ${query}
    Document: ${doc}

    Veuillez renvoyer uniquement le flottant (0 à 1).
  `;

  const modelId = "google/flan-t5-small";
  const url = `https://api-inference.huggingface.co/models/${modelId}`;
  const maxRetries = 10; // Nombre maximum de tentatives
  const retryDelay = 3000; // Délai entre les tentatives (en millisecondes)

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
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

      if (response.ok) {
        const json = await response.json();

        if (Array.isArray(json) && json.length > 0 && json[0].generated_text) {
          const resultText = json[0].generated_text.trim();
          const score = parseFloat(resultText);
          if (!isNaN(score) && score >= 0 && score <= 1) {
            return score;
          }
        }

        console.error("Réponse inattendue depuis l'API:", json);
        return 0;
      } else if (response.status === 503) {
        const json = await response.json();
        const estimatedTime = json.estimated_time || retryDelay / 1000;
        console.log(`Modèle en cours de chargement. Tentative ${attempt} sur ${maxRetries}. Réessai dans ${estimatedTime} secondes...`);
        await new Promise(resolve => setTimeout(resolve, estimatedTime * 1000));
      } else {
        console.error(`Erreur API Hugging Face: ${response.status} - ${await response.text()}`);
        return 0;
      }
    } catch (error) {
      console.error("Erreur lors de l'appel à l'API Hugging Face:", error);
      return 0;
    }
  }

  console.error("Le modèle n'a pas pu être chargé après plusieurs tentatives.");
  return 0;
}




export async function reranking(query: string, qualifyingDocs: any[],rerankingStrategie: string): Promise<RerankedDoc[]> {
    const rerankedDocs = await Promise.all(
      qualifyingDocs.map(async (match) => {
        const text = (match.metadata as Metadata).text;
        const fileName = (match.metadata as Metadata)?.fileName;
        let newScore: number;
  
        switch (rerankingStrategie) {
          case "GPT":
            newScore = await reRankWithGPT(query, text);
            console.log("newScore GPT : ", newScore);
            break;
          case "Huggingface":
            newScore = await reRankWithHuggingFace(query, text);
            console.log("newScore Huggingface : ", newScore);
            break;
          default:
            console.log("[RERANKING] : Aucun modèle n'a été sélectionné")
            newScore = 0;
            break;
        }
        return { text, newScore, fileName };
      })
    );
    const finalDocs = rerankedDocs.sort((a, b) => b.newScore - a.newScore);
    console.log("[RERANKING] finalDocs : ", finalDocs);
    return finalDocs
  }

export async function applyReranking(query: string, qualifyingDocs: Array<{ text: string; score: number; fileName?: string }>, rerankingStrategy: string): Promise<RerankedDoc[]> {
  if (rerankingStrategy != "null") {
    const docsForReranking = qualifyingDocs.map((p) => ({
      metadata: { text: p.text, fileName: p.fileName},
    }));
    return await reranking(query, docsForReranking, rerankingStrategy);
  } else { // Pas de reranking => on se contente du score local cosinus
    const finalDocs = qualifyingDocs.map((p) => ({text: p.text, newScore: p.score, fileName: p.fileName,}));
    return finalDocs.sort((a, b) => b.newScore - a.newScore); // Tri décroissant par newScore
  }
}
  