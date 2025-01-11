CREATE TABLE "configs" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"temperature" real NOT NULL,
	"topP" real NOT NULL,
	"topK" real NOT NULL,
	"maxSteps" integer NOT NULL,
	"stopSequences" text NOT NULL,
	"prompt" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
