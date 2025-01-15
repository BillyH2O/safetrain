import React from 'react'
import { PromptSelector } from './selector/PromptSelector'

type Props = {
    name: string;
}

export const TerminalHeader = ({name}: Props) => {
  return (
    <div className='flex flex-col gap-3'>
        <div className='font-semibold text-lg text-foreground'>Terminal Safetrain IA</div>
        <div className='text-sm'>Modifier les paramètres de votre modèle très simplement dans le Playground Safetrain IA.</div> 
        <div className='mt-5 flex gap-2'>
            <PromptSelector name={name}/>
        </div>
    </div>
  )
}