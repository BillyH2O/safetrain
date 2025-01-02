"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import PDF from "./PDF";

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
        <PDF chat={chat}/>
      ))}
    </div>
  );
};
