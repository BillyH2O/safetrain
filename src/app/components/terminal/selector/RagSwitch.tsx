import { Switch } from '@nextui-org/react'
import React from 'react'
import { cn } from '../../../lib/utils'
import { useChatSettings } from '../../context/ChatContext'

export const RagSwitch = () => {
  const { isRAG, setRAG } = useChatSettings();
  const switchTitle = isRAG
    ? "Désactiver le RAG"
    : "Activer le RAG";
  
  return (
    <Switch
      isSelected={isRAG} onValueChange={setRAG}
      color='primary'
      classNames={{
        base: cn(
          "inline-flex flex-row-reverse w-full max-w-md bg-content1 items-center",
          "justify-between cursor-pointer rounded-lg gap-2 p-5 border-2 border-transparent",
          "bg-secondary border border-border",
        ),
        wrapper: "p-0 h-4 overflow-visible",
        thumb: cn(
          "w-6 h-6 border-2 shadow-lg",
          "group-data-[hover=true]:border-primary",
          "group-data-[selected=true]:ms-6",
          "group-data-[pressed=true]:w-7",
          "group-data-[selected]:group-data-[pressed]:ms-4",
        ),
      }}
    >
      <div className="flex flex-col gap-1">
        <p className="text-medium">{switchTitle}</p>
        <p className="text-tiny ">
            Lorsque cette option est activée, l'agent consulte des sources externes à sa base de connaissance pour enrichir ses réponses.
        </p>
      </div>
    </Switch>
  )
}