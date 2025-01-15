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
import { useChatSettings } from "../../context/ChatContext"
import { embeddingModelOptions } from "../../../../data/model" // Import des options

type Props = {
  disabled: boolean
}

export function EmbeddingModelSelector({ disabled }: Props) {
  const { embeddingModel, setEmbeddingModel } = useChatSettings()

  React.useEffect(() => {
    console.log("nouvelle valeur de embedding Model selectionné :", embeddingModel)
  }, [embeddingModel])

  return (
    <Select onValueChange={setEmbeddingModel} value={embeddingModel}>
      <SelectTrigger disabled={disabled} className="truncate w-auto text-xs">
        <span>{embeddingModel || "embedding"}</span>
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectLabel>modèle embedding</SelectLabel>
          {embeddingModelOptions.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
