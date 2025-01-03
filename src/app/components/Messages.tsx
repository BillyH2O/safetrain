import React from 'react'
import { type Message as TMessage } from 'ai/react'
import { Message } from './Message'
import { MessageSquare } from 'lucide-react'

interface MessagesProps {
    messages: TMessage[]
}

export default function Messages({messages}: MessagesProps) {
  return (
    <div className='flex flex-col h-full'>
        {messages.length ? messages.map((message, i) => (
            <Message key={i} content={message.content} isUserMessage={message.role === "user"}/>
        )) : (
        <div className='flex h-full flex-col items-center justify-center gap-2'>
          
            <h3 className='text-center font-medium text-6xl text-white w-[65%]'>Simplifiez vos PDF grâce à notre  
              <span className="text-gradient"> Agent Autonome</span>
            </h3>
            {/*<MessageSquare className="size-8 text-orange-500"/>*/}
        </div>
      )} 
    </div>
  )
}
