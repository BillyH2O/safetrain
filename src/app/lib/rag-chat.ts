import { ollama, openai, RAGChat, upstash} from "@upstash/rag-chat";
import { redis } from "./redis";


export const RagChat = new RAGChat({
    model: openai("gpt-3.5-turbo"),
    redis: redis, // c'est cette ligne qui permet de persister la data de sessionId dans la BDD
})