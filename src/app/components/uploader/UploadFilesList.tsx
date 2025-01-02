"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import PDF from "./PDF";
import { Switch } from "@nextui-org/react";
import { useState } from "react";

export const UploadedFilesList = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  
  const { data: chats = [], isLoading } = useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const response = await axios.get("/api/get-chats");
      return response.data;
    },
  });

  const handleSwitchChange = () => {
    setIsEnabled((prev) => !prev); // Inverse la valeur actuelle
    console.log("isEnabled", isEnabled);
  };
  
  if (isLoading) {
    return <p>Chargement des données...</p>;
  }

  return (
    <div className="pl-10 h-[80%] w-full mt-20">
    <div className="flex justify-between mb-24">
      <h1 className="text-4xl font-normal">Mes PDF</h1>
      <Switch isSelected={isEnabled} color="success" aria-label="Automatic updates" onChange={handleSwitchChange}/>
    </div>
    <div className="mt-10 flex gap-16 flex-wrap h-full overflow-y-auto">
      {chats.map((chat: any) => (
        <PDF chat={chat} isEnabled={isEnabled}/>
        
      ))}
    </div>
    </div>
  );
};
