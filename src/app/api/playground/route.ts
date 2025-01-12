import { getAllContext} from '@/app/lib/context';
import { db } from '@/app/lib/db';
import { chats, messages as _messages } from '@/app/lib/db/schema';
import { convertToCoreMessages, Message, streamText } from 'ai';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { getModelFromKey } from '../../../utils/modelSelector'
import { generatePrompt } from '../../../utils/prompt'


export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, config} = await req.json();

  if (!config || typeof config !== 'object') {
    return NextResponse.json({ error: "Missing or invalid settings" }, { status: 400 });
  }

  const { selectedModel, chunkingStrategy, rerankingModel, isHybridSearch, temperature, topP, topK, maxSteps, stopSequences, prompt} = config;
  console.log("config :", config); 


  const lastMessage = messages[messages.length - 1];
  const context = await getAllContext(lastMessage.content, chunkingStrategy, rerankingModel, isHybridSearch);
  console.log("[CONTEXT] : ", context)

  const modelInstance = getModelFromKey(selectedModel);
  
  const initial_prompt = generatePrompt("initialPrompt", context)
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