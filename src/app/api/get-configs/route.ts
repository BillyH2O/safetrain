import { db } from "@/app/lib/db";
import { configs } from "@/app/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const userConfigs = await db.select().from(configs).where(eq(configs.userId, userId));

  return NextResponse.json(userConfigs);
}
