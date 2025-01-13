import { NextResponse } from "next/server";
import { db } from "@/app/lib/db"; 
import { parametres } from "@/app/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const rows = await db.select().from(parametres).where(eq(parametres.userId, userId));
  if (rows.length === 0) {
    const [inserted] = await db.insert(parametres).values({
      userId,
      embeddingModel: "text-embedding-ada-002", // valeur par défaut
    }).returning();
    return NextResponse.json(inserted);
  }

  return NextResponse.json(rows[0]);
}

export async function POST(req: Request) {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  
    try {
      const body = await req.json();
      const { embeddingModel } = body;
      
      const updated = await db
        .update(parametres) // On met à jour le paramètre
        .set({ embeddingModel })
        .where(eq(parametres.userId, userId))
        .returning();
  
      // Si pas d'échantillon, on l'insère
      if (updated.length === 0) {
        const [inserted] = await db
          .insert(parametres)
          .values({ userId, embeddingModel })
          .returning();
        return NextResponse.json(inserted);
      }
  
      return NextResponse.json(updated[0]);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "internal server error" }, { status: 500 });
    }
  }
  
