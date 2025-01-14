import React from 'react'
import Link from 'next/link';
import { HoverBorderGradient } from '../ui/hover-border-gradient';
import { PlusCircle } from 'lucide-react';

type Props = {
    chatId: number;
}

export const NewChatButton = ({chatId}: Props) => {
  return (
    <Link key={chatId} href={"/dashboard"} className="flex justify-center text-center mb-3">
        <HoverBorderGradient
            containerClassName="rounded-full"
            as="button"
            className="bg-background text-foreground flex items-center space-x-2">
            <span>Nouveau Chat</span>
            <PlusCircle className='mr-2 w-4 h-4'/>
        </HoverBorderGradient>
    </Link>
  )
}