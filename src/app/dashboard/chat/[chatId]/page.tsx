import ChatList from '@/app/components/chats/ChatList';
import { db } from '@/app/lib/db';
import { chats } from '@/app/lib/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {
    params: {
        chatId: string;
    }
}

const ChatPage = async ({params: {chatId} }: Props) => {
   const {userId} = await auth()
   if(!userId) {
    return redirect('/sign-in')
   } 

   const _chats = await db.select().from(chats).where(eq(chats.userId, userId))
   if (!_chats.find((chat) => chat.id === parseInt(chatId))) {
      return redirect("/");
   }
   
  return (
    <div className='h-full'>
      <ChatList chats={_chats} chatId={parseInt(chatId)}/>
    </div>
  )
}

export default ChatPage;