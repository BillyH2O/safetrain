import { cn } from '@/app/lib/utils';
import { MessageSquare} from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import { NewChatButton } from './NewchatButton';

type Props = {
    chats: {
    userId: string;
    id: number;
    pdfName: string;
    pdfUrl: string;
    createdAt: Date;
    fileKey: string;
    }[],
    chatId: number;
}

export default function ChatList({chats, chatId}: Props) {
  return (
    <div className='flex flex-col gap-5 bg-neutral-900 items-center p-6 h-full overflow-y-scroll overflow-x-hidden'> 
        <NewChatButton chatId={chatId}/>
        
        {chats.map((chat) => (
        <Link key={chat.id} 
            href={`/dashboard/chat/${chat.id}`} 
            className={cn('flex justify-between items-center gap-4 text-white truncate border dark:border-zinc-500 w-full p-3 rounded-lg', {
                        'bg-orange-500 hover:bg-orange-600 text-black' : chat.id === chatId,
                        'bg-neutral-900 hover:bg-neutral-950' : chat.id !== chatId,
        })}>
            {chat.pdfName}
            <MessageSquare className='mr-2 w-4 h-4' />
        </Link>
        ))}
    </div>
  )
}