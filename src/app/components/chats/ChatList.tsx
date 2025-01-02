import { cn } from '@/app/lib/utils';
import { MessageSquare, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

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
    <div className='flex flex-col gap-5 bg-black items-center p-6 h-full overflow-y-scroll overflow-x-hidden'> 
        <Link key={chatId} href={"/dashboard"} className='flex justify-center items-center gap-4 bg-neutral-900 w-72 p-3 dark:border-zinc-500 border border-dashed mb-10'>
            Nouveau Chat
            <PlusCircle className='mr-2 w-4 h-4'/>
        </Link>
        {chats.map((chat) => (
        <Link key={chat.id} 
            href={`/dashboard/chat/${chat.id}`} 
            className={cn('flex justify-between items-center gap-4 text-white w-72 p-4', {
                        'bg-orange-600 text-black' : chat.id === chatId,
                        'bg-neutral-900' : chat.id !== chatId,
        })}>
            {chat.pdfName}
            <MessageSquare className='mr-2 w-4 h-4' />
        </Link>
        ))}
    </div>
  )
}