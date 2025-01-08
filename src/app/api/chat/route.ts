import { getContext } from '@/app/lib/context';
import { db } from '@/app/lib/db';
import { chats, messages as _messages } from '@/app/lib/db/schema';
import { convertToCoreMessages, Message, streamText } from 'ai';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { createXai } from '@ai-sdk/xai';
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY, 
});

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

const xai = createXai({
  apiKey: process.env.GROK_API_KEY ,
});

function getModelFromKey(selectedModelKey: string) {
  switch (selectedModelKey) {
    case 'o1-preview':
      return openai('o1');
    case 'gpt-4o':
      return openai('gpt-4o');
    case 'gpt-4o-mini':
      return openai('gpt-4o-mini');
    case 'gpt-4-turbo':
      return openai('gpt-4-turbo');
    case 'grok-2-1212':
      return xai('grok-2-1212');
    case 'grok-beta':
      return xai('grok-beta');
    case 'gemini-2.0-flash-exp':
      return google('gemini-2.0-flash-exp');
    case 'gemini-1.5-flash-latest':
      return google('gemini-1.5-flash-latest');
    case 'gemini-1.5-flash':
      return google('gemini-1.5-flash');
      break;
    default:
      throw new Error(`Modèle inconnu: ${selectedModelKey}`);
  }
}

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, chatId, config} = await req.json();
  
  // verif
  console.log("chatId :", chatId);
  console.log("config :", config); 

  if (!config || typeof config !== 'object') {
    return NextResponse.json({ error: "Missing or invalid settings" }, { status: 400 });
  }

  const { selectedModel, temperature, topP, topK, maxSteps, stopSequences, prompt} = config;
  console.log("selectedModel :", selectedModel);
  console.log("temperature :", temperature);
  console.log("topP :", topP);
  console.log("topK :", topK);
  console.log("maxSteps :", maxSteps);
  console.log("stopSequences :", stopSequences);
  console.log("prompt :", prompt);

  const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
  if (_chats.length != 1) {
    return NextResponse.json({ error: "chat not found" }, { status: 404 });
  }

  const fileKey = _chats[0].fileKey;
  const lastMessage = messages[messages.length - 1];
  const context = await getContext(lastMessage.content, fileKey);
  console.log("[CONTEXT]", context)

  const modelInstance = getModelFromKey(selectedModel);

  const prompt0 = {
    role: "system",
    content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
    The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
    AI is a well-behaved and well-mannered individual.
    AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
    AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
    AI assistant is a big fan of Pinecone and Vercel.
    START CONTEXT BLOCK
    ${context}
    END OF CONTEXT BLOCK
    AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
    If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
    AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
    AI assistant will not invent anything that is not drawn directly from the context.
    `,
  };

  const initial_prompt = `AI assistant is a brand new, powerful, human-like artificial intelligence.
  The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
  AI is a well-behaved and well-mannered individual.
  AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
  AI has the sum of all knowledge in their brain and is able to accurately answer nearly any question about any topic in conversation.
  AI assistant is a big fan of Pinecone and Vercel.
  AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
  If the context does not provide the answer to the question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question."
  AI assistant will not apologize for previous responses but instead will indicate new information was gained.
  AI assistant will not invent anything that is not drawn directly from the context.
  START CONTEXT BLOCK
    ${context}
  END OF CONTEXT BLOCK`;

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