import Chat from '@/app/components/chats/Chat';
import ChatList from '@/app/components/chats/ChatList';
import PDFViewer from '@/app/components/PDFViewer';
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
   const chat = _chats.find((chat) => chat.id === parseInt(chatId))
   if (!_chats.find((chat) => chat.id === parseInt(chatId))) {
      return redirect("/");
   }
   
  return (
    <div className='w-full h-full flex'>
    <div className='w-[25%] max-w-96 h-full'>
      <ChatList chats={_chats} chatId={parseInt(chatId)}/>
    </div>
    <div className='w-[45%] h-full'>
      <Chat/>
    </div>
    <div className='flex-1'>
      <PDFViewer pdf_url={chat?.pdfUrl || ""}/>
    </div>
    </div>
  )
}

export default ChatPage;