import { getAllContext} from '@/app/lib/context';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';
import { getModelFromKey } from '../../../utils/modelSelector'
import { generatePrompt } from '../../../utils/prompt'
import { auth } from '@clerk/nextjs/server';


export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, config} = await req.json();
  const { userId } = await auth();
  if (!userId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!config || typeof config !== 'object') {
    return NextResponse.json({ error: "Missing or invalid settings" }, { status: 400 });
  }

  const { isRAG, selectedModel, chunkingStrategy, rerankingModel, isHybridSearch, temperature, topP, topK, maxSteps, stopSequences, prompt, embeddingModel} = config;
  console.log("config :", config); 


  const lastMessage = messages[messages.length - 1];
  const context = await getAllContext(userId, lastMessage.content, chunkingStrategy, rerankingModel, isHybridSearch, embeddingModel);
  console.log("[CONTEXT] : ", context)

  const modelInstance = getModelFromKey(selectedModel);
  
  const initial_prompt = generatePrompt("initialPrompt", context, isRAG)
  const prompt_final = initial_prompt + " " + prompt ;
  console.log("prompt_final :", prompt_final);

  const result = streamText({
    model: modelInstance,
    system: prompt_final,
    prompt: lastMessage.content,
    temperature: temperature,
    topK: topK,
    topP: topP,
    maxSteps: maxSteps,
    stopSequences: stopSequences,
  });

  return result.toDataStreamResponse();
}