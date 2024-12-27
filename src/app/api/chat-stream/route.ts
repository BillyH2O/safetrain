import { RagChat } from "@/app/lib/rag-chat";
import { aiUseChatAdapter } from "@upstash/rag-chat/nextjs";
import { NextRequest } from "next/server";


export const POST = async  (req: NextRequest) => {
    const {messages, sessionId} = await req.json()
    
    const lastMessage = messages[messages.length - 1].content

    const response = await RagChat.chat(lastMessage, {streaming: true, sessionId}) 
    console.log("response", response)
    return aiUseChatAdapter(response); // affiche la réponse petit à petit
}