import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import os from "os";
import { pipeline } from "stream";
import { promisify } from "util";

const pipelineAsync = promisify(pipeline);

export async function downloadFromS3(file_key: string): Promise<string> {
  try {
    const s3Client = new S3Client({
      region: "eu-north-1",
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
      },
    });

    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: file_key,
    };

    const command = new GetObjectCommand(params);
    const response = await s3Client.send(command);

    if (!response.Body) {
      throw new Error("Le fichier S3 ne contient pas de données dans Body.");
    }

    const tempDir = os.tmpdir();
    const file_name = `${tempDir}/safetrain${Date.now().toString()}.pdf`;

    await pipelineAsync(response.Body as NodeJS.ReadableStream, fs.createWriteStream(file_name));
    return file_name;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
