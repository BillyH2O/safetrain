"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import PDF from "./PDF";
import { Switch } from "@nextui-org/react";
import { useState } from "react";
import { DefaultPDFMessage } from "../DefaultMessagePDF";
import FileUploader from "./FileUploader";
import { cn } from "@/app/lib/utils";
import { Image, List } from "lucide-react";

export const PDFList = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  
  const { data: chats = [], isLoading } = useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const response = await axios.get("/api/get-chats");
      return response.data;
    },
  });

  const handleSwitchChange = () => {
    setIsEnabled((prev) => !prev);
  };
  
  if (isLoading) {
    return <p>Chargement des données...</p>;
  }

  return chats.length === 0 ? (
    <DefaultPDFMessage />
  ) : (
    <div className="p-10 h-full w-full flex flex-col">
      <div className="flex justify-between w-full">
        <h1 className="text-4xl font-normal">Mes PDF</h1>
        <div className="flex gap-5 items-center justify-center">
            <Switch
              isSelected={isEnabled}
              color="warning"
              aria-label="Automatic updates"
              onChange={handleSwitchChange}
              endContent={<List />}
              startContent={<Image />}
            />
          <FileUploader />
        </div>
      </div>
      <div
        className={cn(
          "mt-20 flex flex-wrap flex-1 overflow-y-auto",
          isEnabled ? "gap-12" : "gap-8"
        )}
      >
        {chats.map((chat: any) => (
          <PDF key={chat.id} chat={chat} isEnabled={isEnabled} />
        ))}
      </div>
    </div>
  );
}
