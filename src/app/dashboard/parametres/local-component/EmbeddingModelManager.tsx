import { EmbeddingModelSelector } from '@/app/components/terminal/selector/EmbeddingModelSelector'
import React from 'react'

export const EmbeddingModelManager = () => {
  return (
    <div className='flex flex-col items-center justify-center bg-secondary border rounded-lg p-10 gap-10'>
      <div className="max-w-xl w-full p-6">
        <h2 className="mb-4 text-xl font-semibold">
          Attention
        </h2>
        <p className="leading-relaxed">
          Pour garantir la cohérence et l&apos;efficacité d&apos;un système de RAG tel que Safetrain, il faut utiliser le même modèle d&apos;embedding pour l&apos;ensemble du processus. Veuillez supprimer tous les documents que vous avez uploadés avant de changer le modèle utilisé pour les embeddings.
        </p>
      </div>

      <div className='flex items-center gap-10'>
        <EmbeddingModelSelector disabled={false} />
        <button onClick={() => alert("Tous les documents ont été supprimés !")} className="p-2 text-white bg-red-600 rounded-md hover:bg-red-800">
          Supprimer tous les documents
        </button>
      </div>
    </div>
  )
}
