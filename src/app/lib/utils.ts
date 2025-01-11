import { type ClassValue, clsx} from "clsx";
import { twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]){
    return twMerge(clsx(inputs));
}

export function convertToAscii(inputString: string) {
    // remove non ascii characters
    const asciiString = inputString.replace(/[^\x00-\x7F]+/g, "");
    return asciiString;
  }

export function cosineSimilarity(a: number[], b: number[]): number {
  // a et b : vecteurs de même taille
  let dot = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}