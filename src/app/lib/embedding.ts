import { OpenAIApi, Configuration } from "openai-edge";
import { GoogleGenerativeAI } from "@google/generative-ai";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function getDefaultEmbeddings(text: string) {
  try {
    const response = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: text.replace(/\n/g, " "),
    });
    const result = await response.json();
    return result.data[0].embedding as number[];
  } catch (error) {
    console.log("error calling openai embeddings api", error);
    throw error;
  }
}

export async function getEmbeddings(text: string, model: string) {
  switch (model) {
    case "text-embedding-ada-002":
    case "text-embedding-3-small":
    //case "text-embedding-3-large":
      return await getOpenAIEmbedding(text, model);

    case "text-embedding-004":
      return await getGeminiEmbedding(text, model);

    default:
      console.warn(`Model "${model}" non reconnu, utilisation du modèle par défaut`);
      return await getOpenAIEmbedding(text, "text-embedding-ada-002");
  }
}

async function getOpenAIEmbedding(text: string, model: string) {
  try {
    const response = await openai.createEmbedding({
      model,
      input: text.replace(/\n/g, " "),
    });
    const result = await response.json();
    return result.data[0].embedding as number[];
  } catch (error) {
    console.log("Error calling OpenAI embeddings API", error);
    throw error;
  }
}

async function getGeminiEmbedding(text: string, model: string) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("La variable d'environnement GEMINI_API_KEY n'est pas définie");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); 
    const geminiModel = genAI.getGenerativeModel({ model: model });
    const cleanedText = text.replace(/\n/g, " ");
    const response = await geminiModel.embedContent(cleanedText);
    
    return response.embedding.values as number[];
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API Gemini embeddings", error);
    throw error;
  }
}