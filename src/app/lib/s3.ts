import { S3Client, PutObjectCommand, DeleteObjectCommand} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToS3(file: File) {
  try {
    const s3Client = new S3Client({
      region: "eu-north-1",
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
      },
    });

    const file_key = "uploads/" + Date.now().toString() + file.name.replace(" ", "-");

    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: file_key,
      Body: file,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    console.log("Successfully uploaded to S3!", file_key);

    return {
      file_key,
      file_name: file.name,
    };
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw error;
  }
}

export function getS3Url(file_key: string) {
  return `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.eu-north-1.amazonaws.com/${file_key}`;
}

export async function uploadBufferToS3(
  buffer: Buffer, 
  fileName: string
): Promise<{ file_key: string; file_name: string }> {
  try {
    // Générer une clé unique
    const isThumbnail = fileName.toLowerCase().endsWith(".png");

    // Générer la clé en fonction du type de fichier
    const file_key = isThumbnail
      ? "uploads/" + Date.now().toString() + fileName.replace(" ", "-")
      : fileName.replace(" ", "-");
    
    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: file_key,
      Body: buffer, // <= ICI on passe un Buffer
    };

    console.log("BUCKET NAME =>", process.env.NEXT_PUBLIC_S3_BUCKET_NAME);
    
    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    console.log("Successfully uploaded buffer to S3!", file_key);

    return {
      file_key,
      file_name: fileName,
    };
  } catch (error) {
    console.error("Error uploading buffer to S3:", error);
    throw error;
  }
}

export async function deleteS3Object(key: string): Promise<void> {
  try {
    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: key,
    };
    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);
    console.log(`Objet S3 supprimé : ${key}`);
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'objet ${key} :`, error);
    throw error;
  }
}

export async function deleteChatS3Files(fileKey: string, thumbnailUrl: string | null) {
  // Construire les clés attendues sur S3
  const pdfKey = fileKey;
  const bm25StandardIndexKey = `${fileKey}_standard_bm25.json`;
  const bm25StandardDocsKey  = `${fileKey}_standard_bm25_docs.json`;
  const bm25LateIndexKey = `${fileKey}_late_chunking_bm25.json`;
  const bm25LateDocsKey  = `${fileKey}_late_chunking_bm25_docs.json`;

  const keysToDelete = [pdfKey, bm25StandardIndexKey, bm25StandardDocsKey, bm25LateIndexKey, bm25LateDocsKey];
  if (thumbnailUrl) {
    const thumbnailKey = extractS3KeyFromUrl(thumbnailUrl);
    keysToDelete.push(thumbnailKey);
  }

  for (const key of keysToDelete) {
    try {
      await deleteS3Object(key);
    } catch (err) {
      console.error(`Erreur sur la suppression du fichier ${key}:`, err);
    }
  }
}

function extractS3KeyFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    // La clé est le chemin sans le premier "/"
    return urlObj.pathname.slice(1);
  } catch (error) {
    console.error("Erreur lors de l'extraction de la clé S3 depuis l'URL :", error);
    return url;
  }
}