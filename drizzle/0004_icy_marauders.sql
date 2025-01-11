-- Ajouter les colonnes avec des valeurs par défaut
ALTER TABLE "configs" ADD COLUMN "chunking_strategy" text DEFAULT 'standard';
ALTER TABLE "configs" ADD COLUMN "reranking_model" text DEFAULT 'null';

-- Mettre à jour les lignes existantes pour éviter les valeurs NULL
UPDATE "configs"
SET "chunking_strategy" = 'standard'
WHERE "chunking_strategy" IS NULL;

UPDATE "configs"
SET "reranking_model" = 'null'
WHERE "reranking_model" IS NULL;
