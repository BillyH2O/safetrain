ALTER TABLE "configs" ALTER COLUMN "chunking_strategy" SET DEFAULT 'standard';--> statement-breakpoint
ALTER TABLE "configs" ALTER COLUMN "reranking_model" SET DEFAULT 'null';

UPDATE "configs"
SET "chunking_strategy" = 'standard'
WHERE "chunking_strategy" IS NULL;

UPDATE "configs"
SET "reranking_model" = 'null'
WHERE "reranking_model" IS NULL;