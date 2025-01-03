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
    <div className='flex flex-col gap-5 bg-neutral-900 items-center p-6 h-full overflow-y-scroll overflow-x-hidden'> 
        <Link key={chatId} href={"/dashboard"} className='flex justify-center items-center gap-4 bg-zinc-950 hover:bg-orange-600 w-72 p-6 dark:border-zinc-500 border border-dashed mb-10 rounded-lg'>
            Nouveau Chat
            <PlusCircle className='mr-2 w-4 h-4'/>
        </Link>
        {chats.map((chat) => (
        <Link key={chat.id} 
            href={`/dashboard/chat/${chat.id}`} 
            className={cn('flex justify-between items-center gap-4 text-white truncate border dark:border-zinc-500 w-72 p-6 py-8 rounded-lg', {
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