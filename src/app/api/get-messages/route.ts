
import { db } from "@/app/lib/db";
import { messages } from "@/app/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

export const POST = async (req: Request) => {
  const { chatId } = await req.json();
  console.log('Route chatId:', chatId);
  const _messages = await db
    .select()
    .from(messages)
    .where(eq(messages.chatId, chatId));
    console.log('_messages : ', _messages);
  return NextResponse.json(_messages);
};