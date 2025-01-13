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
} from "../../ui/select"
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useChatSettings } from "../../context/ChatContext";

type Props = {
    disabled:boolean
}
  
export function EmbeddingModelSelector({disabled}:Props) {

  const { embeddingModel, setEmbeddingModel } = useChatSettings(); 

  React.useEffect(() => {
    console.log("Nouvelle valeur de embedding Model :", embeddingModel);
  }, [embeddingModel]);

  return (
    <Select onValueChange={setEmbeddingModel} value={embeddingModel}>
      <SelectTrigger disabled={disabled} className="truncate w-auto text-xs">
      <span>{embeddingModel || "embedding"}</span>
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>    
            <SelectLabel>modèle embedding</SelectLabel>
            <SelectItem value="text-embedding-ada-002">text-embedding-ada-002</SelectItem>
            <SelectItem value="text-embedding-3-small">text-embedding-3-small</SelectItem>
            {/*<SelectItem value="text-embedding-004">text-embedding-004</SelectItem>*/}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

