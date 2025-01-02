// src/components/uploader/UploadedFilesListServer.tsx
import { db } from "@/app/lib/db";
import { chats } from "@/app/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import Link from "next/link";
import React from "react";

export const UploadedFilesList = async () => {
  const { userId } = await auth();

  if (!userId) {
    return null; // Vous pouvez gérer une redirection plus haut dans la hiérarchie des routes.
  }

  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));

  return (
    <div className="mt-24 flex justify-center items-center gap-5 flex-wrap h-96 overflow-y-scroll">
      {_chats.map((chat) => (
        <Link
          key={chat.id}
          href={`/dashboard/chat/${chat.id}`}
          className="w-[500px] h-[100px] bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 p-4 rounded-lg mt-2 flex justify-between items-center"
        >
          <p className="text-sm text-neutral-700 dark:text-neutral-300 truncate max-w-xs">
            {chat.pdfName}
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            modifié le 27
          </p>
        </Link>
      ))}
    </div>
  );
};
