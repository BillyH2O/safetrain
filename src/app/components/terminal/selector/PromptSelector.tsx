"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "../../ui/select"
import { useChatSettings } from "../../context/ChatContext";
import { useConfigs } from "@/app/hooks/useConfigs";

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
    const { configs } = useConfigs();

  return (
    <Select onValueChange={(value) => {
        const selectedId = value ? parseInt(value) : null;
        setIdConfigSelected(selectedId);  
        console.log(`Config sélectionnée : ${selectedId !== null ? selectedId : "Aucune"}`);
      }}>
      <SelectTrigger className="w-full truncate">
      <span>{name || "Selectionnez un agent autonome"}</span>
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>   
        <SelectLabel>template</SelectLabel> 
        {configs?.map((config: Config) => (
            <SelectItem key={config.id} value={config.id.toString()}>{config.name}</SelectItem>
        ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

