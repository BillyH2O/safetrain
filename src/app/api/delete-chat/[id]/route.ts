import {NextResponse} from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/app/lib/db";
import { chats, messages } from "@/app/lib/db/schema";
import { deleteNamespace } from "@/app/lib/pinecone";
import { deleteChatS3Files } from "@/app/lib/s3";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic"; // <-- Indique qu'on force la route en mode dynamique

export async function DELETE({ params }: { params: { id: string } }) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const { id } = await params;
  const chatId = parseInt(id, 10);

  if (!chatId) {
    return NextResponse.json({ error: "Invalid chat ID" }, { status: 400 });
  }

  try {
    const chatToDelete = await db.select().from(chats).where(eq(chats.id, chatId));
  
    const { fileKey, thumbnailUrl, userId: chatUserId } = chatToDelete[0];
    if (chatUserId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.delete(messages).where(eq(messages.chatId, chatId));
    await await db.delete(chats).where(eq(chats.id, chatId));
    await deleteNamespace(fileKey)
    await deleteChatS3Files(fileKey, thumbnailUrl);

    return NextResponse.json({ message: "[SUCCES] Chat supprimé"});
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", details: error },
      { status: 500 }
    );
  }
}
