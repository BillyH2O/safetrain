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

  }
  

export function RerankingSelector({}:Props) {

    const {rerankingModel, setRerankingModel} = useChatSettings(); 

  return (
    <Select onValueChange={(value) => setRerankingModel(value)} value={rerankingModel}>
      <SelectTrigger className="w-1/2 truncate">
      <span>{rerankingModel !== "null" ? rerankingModel : "reranking"}</span>
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>    
            <SelectLabel>modèle</SelectLabel>
            <SelectItem value="null">aucun</SelectItem>
            <SelectItem value="GPT">GPT</SelectItem>
            <SelectItem value="Huggingface">Huggingface</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

