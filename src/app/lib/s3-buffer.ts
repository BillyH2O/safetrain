// s3Server.ts (SERVER-SIDE)
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const s3Client = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
  },
});

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

export function getS3Url(file_key: string) {
  return `https://${process.env.S3_BUCKET_NAME}.s3.eu-north-1.amazonaws.com/${file_key}`;
}
