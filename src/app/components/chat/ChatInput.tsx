import React from 'react'
import { ModelSelector } from '../terminal/selector/ModelSelector';
import { QueryInput } from './QueryInput';
import { TerminalSheet } from '../terminal/TerminalSheet';

type ChatInputProps = {
  isPlayground: boolean
}

const ChatInput = ({isPlayground}: ChatInputProps) => {
 
  return (
    <div className='flex flex-col h-full w-full justify-center items-center gap-3'>
        <QueryInput/>
        <div className='flex gap-2 justify-center items-center'>
          <ModelSelector/>
          {!isPlayground && <TerminalSheet/>} 
        </div>
        
      
      </div>  
  )
}

export default ChatInput