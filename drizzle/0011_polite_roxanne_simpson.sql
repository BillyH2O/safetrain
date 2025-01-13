CREATE TABLE "parametres" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"embedding_model" text DEFAULT 'text-embedding-ada-002' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "embedding_model" text DEFAULT 'text-embedding-ada-002' NOT NULL;