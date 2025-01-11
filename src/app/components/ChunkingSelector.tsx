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

type Props = {}
  
export function ChunkingSelector({}:Props) {

    const {chunkingStrategy, setChunkingStrategy} = useChatSettings(); 

  return (
    <Select onValueChange={(value) => setChunkingStrategy(value)} value={chunkingStrategy}>
      <SelectTrigger className="w-1/2 truncate">
      <span>{chunkingStrategy || "chunking"}</span>
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>    
            <SelectLabel>stratégie</SelectLabel>
            <SelectItem value="standard">standard</SelectItem>
            <SelectItem value="late_chunking">late chunking</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

