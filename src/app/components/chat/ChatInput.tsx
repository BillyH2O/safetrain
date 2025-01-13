import React from 'react'
import { PlaceholdersAndVanishInput } from '../ui/placeholdersAndVanishInput';
import Terminal from '../terminal/Terminal';
import { useChatSettings } from '../context/ChatContext';
import { ModelSelector } from '../terminal/selector/ModelSelector';
import { QueryInput } from './QueryInput';

type ChatInputProps = {
  isPlayground: boolean
}

const ChatInput = ({isPlayground}: ChatInputProps) => {
 
  return (
    <div className='flex flex-col h-full w-full justify-center items-center '>
        <div className='flex gap-2 justify-center items-center'>
          <ModelSelector/>
          {!isPlayground && <Terminal/>} 
        </div>
        
      <QueryInput/>
      </div>  
  )
}

export default ChatInput