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

type Props = {
  isPlayground:boolean
}
  

export function RerankingSelector({isPlayground}:Props) {

  const {rerankingModel, setRerankingModel} = useChatSettings(); 

  return (
    <Select onValueChange={(value) => setRerankingModel(value)} value={rerankingModel}>
      <SelectTrigger className="truncate" disabled={!isPlayground}>
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

