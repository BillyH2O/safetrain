import { db } from "@/app/lib/db";
import { configs } from "@/app/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server"; 

export async function POST(req: Request, res: Response){
    const { userId } = await auth();
    console.log("userId : ", userId)
    if (!userId) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    try {
        const body = await req.json()
        const{config} = body

        if (!config.name) {
            return NextResponse.json({ error: "no_name" }, { status: 400 });
        }

        const existing = await db.select().from(configs).where(
            and(eq(configs.name, config.name), eq(configs.userId, userId))
          );
        
          if (existing.length > 0) {
            return NextResponse.json({ error: "duplicate_name" }, { status: 400 });
          }

        const config_id = await db.insert(configs).values({
            name: config.name,
            chunkingStrategy: config.chunkingStrategy,
            rerankingModel: config.rerankingModel,
            temperature: config.temperature,
            topP: config.topP,
            topK: config.topK,
            maxSteps: config.maxSteps,
            stopSequences: config.stopSequences,
            prompt: config.prompt,
            userId: userId
        })
        .returning({
            insertedId: configs.id,
          });

        return NextResponse.json({
            chat_id: config_id[0].insertedId
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
