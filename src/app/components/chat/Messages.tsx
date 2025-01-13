import React from 'react'
import { type Message as TMessage } from 'ai/react'
import { Message } from './Message'
import { MessageSquare } from 'lucide-react'
import { Button } from '../ui/button/Button'
import { ButtonFeature } from '../ui/button/ButtonFeature'
import { ListButtonFeature } from './ListButtonFeature'
import { useChatSettings } from '../context/ChatContext'
import { DefaultMessage } from './DefaultMessageChat'

interface MessagesProps {
  variant?: "large" | "small";
}

export default function Messages({variant}: MessagesProps) {
  const { messages } = useChatSettings();
  return (
    <div className='flex flex-col h-full'>
        {messages.length ? messages.map((message, i) => (
            <Message key={i} content={message.content} isUserMessage={message.role === "user"}/>
        )) : (
          <DefaultMessage variant={variant}/>
      )} 
    </div>
  )
}
