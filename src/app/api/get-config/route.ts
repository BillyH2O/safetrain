import { db } from "@/app/lib/db";
import { configs } from "@/app/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const idConfigSelected =  Number(url.searchParams.get("idConfigSelected"));

  const configSelected = await db
    .select()
    .from(configs)
    .where(and(eq(configs.userId, userId), eq(configs.id, idConfigSelected))
);

  return NextResponse.json(configSelected);
}
