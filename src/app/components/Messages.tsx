import React from 'react'
import { type Message as TMessage } from 'ai/react'
import { Message } from './Message'
import { MessageSquare } from 'lucide-react'

interface MessagesProps {
    messages: TMessage[]
}

export default function Messages({messages}: MessagesProps) {
  return (
    <div className='flex flex-col'>
        {messages.length ? messages.map((message, i) => (
            <Message key={i} content={message.content} isUserMessage={message.role === "user"}/>
        )) : (
        <div className='flex flex-1 flex-col items-center justify-center gap-2'>
          <MessageSquare className="size-8 text-blue-500"/>
            <h3 className='font-semibold text-xl text-white'>Chat opérationnel !</h3>
            <p className="text-zinc-500 text-sm">Posez votre première question</p>
        </div>
      )} 
    </div>
  )
}
