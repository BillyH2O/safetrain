import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/app/lib/db";
import { chats, messages } from "@/app/lib/db/schema";
import { deleteNamespace } from "@/app/lib/pinecone";

export const dynamic = "force-dynamic"; // <-- Indique qu'on force la route en mode dynamique

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const chatId = parseInt(id, 10);

  if (!chatId) {
    return NextResponse.json({ error: "Invalid chat ID" }, { status: 400 });
  }

  try {
    await db.delete(messages).where(eq(messages.chatId, chatId));

    const chatToDelete = await db.select().from(chats).where(eq(chats.id, chatId));
    const fileKey = chatToDelete[0].fileKey

    const deletedChat = await db.delete(chats).where(eq(chats.id, chatId));
    deleteNamespace(fileKey)

    return NextResponse.json({ message: "[SUCCES] Chat supprimé", deletedChat });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", details: error },
      { status: 500 }
    );
  }
}
