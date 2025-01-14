import React from 'react'
import { Message } from './Message'
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
