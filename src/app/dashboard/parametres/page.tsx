"use client"

import { EmbeddingModelSelector } from '@/app/components/EmbeddingModelSelectorUpload'
import { RagSwitch } from '@/app/components/RagSwitch'
import React from 'react'

type Props = {}

export default function Page({}: Props) {
  return (
    <div className='h-full w-full flex flex-col justify-center items-center'>
      <h1 className="text-4xl font-normal p-10 w-full">Paramètres</h1>

      <div className="h-full w-full flex flex-col items-center justify-center gap-14 p-8 ">
      <RagSwitch/>
        <div className='flex flex-col items-center justify-center bg-zinc-950 border rounded-lg p-10 gap-10'>
          <div className="max-w-xl w-full p-6 shadow-md rounded-lg ">
            <h2 className="mb-4 text-xl font-semibold">
              Attention
            </h2>
            <p className="leading-relaxed">
              Pour garantir la cohérence et l'efficacité d'un système de RAG tel que Safetrain, il faut utiliser le même modèle d'embedding pour l'ensemble du processus. Veuillez supprimer tous les documents que vous avez uploadés avant de changer le modèle utilisé pour les embeddings.
            </p>
          </div>

          <div className='flex items-center gap-10'>
          <EmbeddingModelSelector disabled={false} />
          <button onClick={() => alert("Tous les documents ont été supprimés !")} className="p-2 text-white bg-red-600 rounded-md hover:bg-red-700">
            Supprimer tous les documents
          </button>
          </div>
          
        </div>
        
      </div>
    </div>
  )
}
