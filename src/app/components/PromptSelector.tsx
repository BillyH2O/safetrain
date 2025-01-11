"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useChatSettings } from "./context/ChatContext";

type Config = {
    id: number;
    name: string;
    temperature: number;
    topP: number;
    topK: number;
    maxSteps: number;
    stopSequences: string;
    prompt: string;
    createdAt: string;
    userId: string;
  };

  type Props = {
    name: string
  }
  

export function PromptSelector({name}: Props) {

    const {setIdConfigSelected} = useChatSettings(); 
    
    const { data } = useQuery({
        queryKey: ["configs-selector"],
        queryFn: async () => {
          const response = await axios.get("/api/get-configs");
          return response.data;
        },
    });

  return (
    <Select onValueChange={(value) => {
        const selectedId = value ? parseInt(value) : null;
        setIdConfigSelected(selectedId);  
        console.log(`Config sélectionnée : ${selectedId !== null ? selectedId : "Aucune"}`);
      }}>
      <SelectTrigger className="w-full">
      <span>{name || "Selectionnez une config"}</span>
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>    
        {data?.map((config: Config) => (
            <SelectItem key={config.id} value={config.id.toString()}>{config.name}</SelectItem>
        ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

