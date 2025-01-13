ALTER TABLE "chats" ADD COLUMN "embedding_model" text DEFAULT 'text-embedding-ada-002' NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" DROP COLUMN "embedding_model";