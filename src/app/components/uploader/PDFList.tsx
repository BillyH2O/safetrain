"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import PDF from "./PDF";
import { Switch } from "@nextui-org/react";
import { useState } from "react";

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

  return (
    <div className="pl-10 h-full w-full flex flex-col">
    <div className="flex justify-between mb-12 w-[90%] ">
      <h1 className="text-4xl font-normal">Mes PDF</h1>
      <Switch isSelected={isEnabled} color="success" aria-label="Automatic updates" onChange={handleSwitchChange}/>
    </div>
    <div className="mt-10 flex gap-16 flex-wrap flex-1 overflow-y-auto">
      {chats.map((chat: any) => (
        <PDF chat={chat} isEnabled={isEnabled}/>
        
      ))}
    </div>
    </div>
  );
};
