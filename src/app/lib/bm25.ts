import winkBM25 from "wink-bm25-text-search";
import { downloadFromS3 } from "./s3-server";
import fs from "fs";
import { removeDiacritics, sanitizeText, sigmoidNormalization } from "./utils";

export interface HybridDoc {
  text: string;
  score: number;
  fileName?: string;
}

type BM25Index = [any, any, any, any];

// Type de chaque résultat renvoyé par `bm25.search()`
export type BM25SearchResult = [string, number];

export async function getBM25Matches(query: string, fileKey: string, chunkingMethod: string): Promise<{ text: string; score: number }[]> {
    try {
      const fileName = `${fileKey}_${chunkingMethod}_bm25.json`;
      const docsFileName = `${fileKey}_${chunkingMethod}_bm25_docs.json`;
      const indexPath = await downloadFromS3(fileName);
      const docsPath = await downloadFromS3(docsFileName);
      
      if (!docsPath) {
        console.error("Erreur: Le chemin vers les documents BM25 est invalide.");
        throw new Error("Le chemin vers les documents BM25 est invalide.");
      }
  
      if (!indexPath || !docsPath) {
        console.warn("Index ou documents non disponibles, retour d'un tableau vide.");
        return [];
      }
      
      const rawIndex = fs.readFileSync(indexPath, "utf8");
      const exportedIndex = JSON.parse(rawIndex) as BM25Index;
      const rawDocs = fs.readFileSync(docsPath, "utf8");
      const docContents = JSON.parse(rawDocs) as string[];
      
      const bm25 = winkBM25();
      bm25.defineConfig({fldWeights: {body: 1}}); // structure donnée à winkBM25

      bm25.definePrepTasks([
        function (text: string): string[] {
          // Nettoyage minimal : convertir en minuscules et splitter par espaces
          const noAccents = removeDiacritics(text.toLowerCase());
          return noAccents.split(/\s+/);
        }
      ]);
      
      bm25.importJSON(exportedIndex);
      const queryAsString = String(query ?? ""); 
  
      const results: BM25SearchResult[] = bm25.search(queryAsString);
      const scores = results.map(r => r[1]);
      //const minScore = Math.min(...scores);
      //const maxScore = Math.max(...scores);
      const meanScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      const alpha = 1;

      const matches = results.map((r: BM25SearchResult) => {
        const docId = parseInt(r[0], 10);
        const rawScore = r[1];
        //const normalizedScore = (maxScore - minScore) !== 0 ? (rawScore - minScore) / (maxScore - minScore): 1;
        const normalizedScore = sigmoidNormalization(rawScore, alpha, meanScore)
        const score = normalizedScore; // Normalisation du score
        const text = sanitizeText(docContents[docId] || "");
        console.debug(`Document id: ${docId}, score: ${score}, extrait du texte: "${text.substring(0, 100)}..."`);
        return { text, score };
      });
      
      console.debug(`Téléchargement du fichier index BM25 depuis S3: ${fileName}`);
      console.debug(`Chemin du fichier index téléchargé: ${indexPath}`);
      console.debug(`Téléchargement du fichier documents BM25 depuis S3: ${docsFileName}`);
      console.debug(`Chemin du fichier documents téléchargé: ${docsPath}`);
      console.debug(`Lecture du fichier index BM25 depuis ${indexPath}`);
      //console.debug("Contenu brut de l'index:", rawIndex);
      console.debug(`Lecture du fichier documents BM25 depuis ${docsPath}`);
      //console.debug("Contenu brut des documents:", rawDocs);
      console.debug("Initialisation de BM25 avec les données chargées");
      console.debug(`Nom du fichier index BM25: ${fileName}`);
      console.debug(`Nom du fichier documents BM25: ${docsFileName}`);
      console.debug(`getBM25Matches appelée avec query: "${query}", fileKey: "${fileKey}", chunkingMethod: "${chunkingMethod}"`);
      console.debug(`Exécution de la recherche BM25 pour la requête: "${query}"`);
      console.debug("Résultats de la recherche:", results);
      console.debug(`Score meanScore BM25: ${meanScore}`);
      console.debug("Résultat final des correspondances BM25:", matches);
      return matches;
    } catch (error) {
      console.error("Erreur dans getBM25Matches:", error);
      throw error;
    }
  }

export async function applyHybridSearch(pineconeDocs: { text: string; score: number }[], query: string, fileKey: string, chunkingMethod: string, isHybridSearch: boolean): Promise<HybridDoc[]> {
  if (!isHybridSearch) {
    return pineconeDocs;
  }
  const bm25Docs = await getBM25Matches(query, fileKey, chunkingMethod);
  return [...pineconeDocs, ...bm25Docs];
}
