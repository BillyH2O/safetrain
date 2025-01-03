import { cn } from '@/app/lib/utils';
import { MessageSquare, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import { HoverBorderGradient } from '../ui/hover-border-gradient';

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
    <div className='flex flex-col gap-5 bg-neutral-900 items-center p-4 h-full overflow-y-scroll overflow-x-hidden'> 
        <Link key={chatId} href={"/dashboard"} className="flex justify-center text-center mb-3">
            <HoverBorderGradient
                containerClassName="rounded-full"
                as="button"
                className="dark:bg-neutral-900 bg-white text-black dark:text-white flex items-center space-x-2">
                <span>Nouveau Chat</span>
                <PlusCircle className='mr-2 w-4 h-4'/>
            </HoverBorderGradient>
        </Link>
        
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