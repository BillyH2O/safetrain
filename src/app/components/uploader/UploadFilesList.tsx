"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";

export const UploadedFilesList = () => {
  const { data: chats = [], isLoading } = useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const response = await axios.get("/api/get-chats");
      return response.data;
    },
  });

  if (isLoading) {
    return <p>Chargement des données...</p>;
  }

  return (
    <div className="mt-24 flex justify-center items-center gap-5 flex-wrap h-96 overflow-y-scroll">
      {chats.map((chat: any) => (
        <Link
          key={chat.id}
          href={`/dashboard/chat/${chat.id}`}
          className="w-[500px] h-[100px] bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 p-4 rounded-lg mt-2 flex justify-between items-center"
        >
          <img
            src={chat.thumbnailUrl || chat.pdfUrl}
            alt={chat.pdfName}
            className="w-16 h-16 object-cover rounded-lg"
          />
          <p className="text-sm text-neutral-700 dark:text-neutral-300 truncate max-w-xs">
            {chat.pdfName}
          </p>
        </Link>
      ))}
    </div>
  );
};
