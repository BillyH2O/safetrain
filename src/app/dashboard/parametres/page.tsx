"use client"

import { RagSwitch } from '@/app/components/terminal/selector/RagSwitch'
import React from 'react'
import { EmbeddingModelManager } from './local-component/EmbeddingModelManager'

type Props = {}

export default function Page({}: Props) {
  return (
    <div className='h-full w-full flex flex-col justify-center items-center'>
      <h1 className="text-4xl font-normal p-10 w-full">Paramètres</h1>
      <div className="h-full w-full flex flex-col items-center justify-center gap-14 p-8 ">
        <RagSwitch/>
        <EmbeddingModelManager/>
      </div>
    </div>
  )
}
