import { db } from "@/app/lib/db";
import { chats } from "@/app/lib/db/schema";
import { generatePdfThumbnail } from "@/app/lib/pdf";
import { loadS3IntoPinecone } from "@/app/lib/pinecone";
import { getS3Url } from "@/app/lib/s3";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server"; 

export async function POST(req: Request, res: Response){
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    try {
        const body = await req.json()
        const{file_key, file_name, embeddingModel} = body
        console.log("body :", body)

        await Promise.all([
            loadS3IntoPinecone(file_key, embeddingModel, "standard"),
            loadS3IntoPinecone(file_key, embeddingModel, "late_chunking")
          ]);          

        const thumbnailKey = await generatePdfThumbnail(file_key);
        console.log("pdf url :", getS3Url(file_key))

        const chat_id = await db.insert(chats).values({
            fileKey: file_key,
            pdfName: file_name,
            pdfUrl: getS3Url(file_key),
            userId: userId,
            thumbnailUrl: thumbnailKey ? getS3Url(thumbnailKey) : null,
            embeddingModel: embeddingModel,
        })
        .returning({
            insertedId: chats.id,
          });

        return NextResponse.json({
            chat_id: chat_id[0].insertedId
        },
    { status: 200})
    } catch(error) {
        console.error(error);
        return NextResponse.json(
            { error: "internal server error" },
            { status: 500}
        )
    }
}
