import { getContext, getContextLateChunking } from '@/app/lib/context';
import { db } from '@/app/lib/db';
import { chats, messages as _messages } from '@/app/lib/db/schema';
import { streamText } from 'ai';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { getModelFromKey } from '../../../utils/modelSelector'
import { generatePrompt } from '../../../utils/prompt'


export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, chatId, config} = await req.json();

  if (!config || typeof config !== 'object') {
    console.log("config : ", config)
    console.log("Missing or invalid settings")
    return NextResponse.json({ error: "Missing or invalid settings" }, { status: 400 });
  }

  const { isRAG, selectedModel, chunkingStrategy, rerankingModel, isHybridSearch, temperature, topP, topK, maxSteps, stopSequences, prompt, embeddingModel} = config;
  console.log("chatId :", chatId);
  console.log("config :", config); 

  const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
  if (_chats.length != 1) {
    return NextResponse.json({ error: "chat not found" }, { status: 404 });
  }

  const fileKey = _chats[0].fileKey;
  const lastMessage = messages[messages.length - 1];

  let context;
  switch (chunkingStrategy) {
    case 'standard':
      context = await getContext(lastMessage.content, fileKey, rerankingModel, isHybridSearch, embeddingModel);
      break;
    case 'late chunking':
      context = await getContextLateChunking(lastMessage.content, fileKey, 10, rerankingModel, isHybridSearch, embeddingModel);
      break;
    default:
      context = await getContext(lastMessage.content, fileKey, rerankingModel, isHybridSearch, embeddingModel);
      break;
  }
  console.log("[CONTEXT]", context)

  const modelInstance = getModelFromKey(selectedModel);
  
  const initial_prompt = generatePrompt("initialPrompt", context, isRAG)
  const prompt_final = initial_prompt + " " + prompt ;
  console.log("prompt_final :", prompt_final);
  let assistantResponse = "";

  const result = streamText({
    //messages: [
      //  prompt,
        //...messages.filter((message: Message) => message.role === "user"),
      //],
    model: modelInstance,
    system: prompt_final,
    prompt: lastMessage.content,
    temperature: temperature,
    topK: topK,
    topP: topP,
    maxSteps: maxSteps,
    stopSequences: stopSequences,
    onFinish: async ({ text }) => {
        try {
          await db.insert(_messages).values({
            chatId,
            content: lastMessage.content,
            role: "user",
          });
          if (text.trim()) {
            assistantResponse = text;
            await db.insert(_messages).values({
              chatId,
              content: assistantResponse,
              role: "system",
            });
          }
        } catch (error) {
          console.error('Failed to save messages:', error);
        }
      },
    });

  return result.toDataStreamResponse();
}