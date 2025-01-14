"use client"

import Link from 'next/link'
import React from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { useDeleteChat } from '@/app/hooks/useDeleteChat';

type PdfProps = {
  chat: any,
  isEnabled: boolean,
  refetchChats: () => void,
}

const PDF = ({chat, isEnabled, refetchChats}: PdfProps) => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  
  const { deleteChat, isLoading, error } = useDeleteChat(() => {
    // Rafraîchir la liste des chats après suppression
    refetchChats();
  });

  const handleDelete = () => {
    deleteChat(chat.id).catch((err) => {
      console.error("Erreur lors de la suppression du chat :", err);
    });
  };
  /*
  const queryClient = useQueryClient();
  const deleteChatMutation = useDeleteChatTanstack()
  const handleDelete = () => {
    deleteChatMutation.mutate(chat.id);
  };*/

  return (
    <div key={chat.id}>
      
      {isEnabled ? (
        <button onClick={onOpen} className="h-72">
          <img src={chat.thumbnailUrl || chat.pdfUrl} alt={chat.pdfName} className="h-full rounded-lg"/>
        </button>
      ) : (
        <Button onPress={onOpen}  className="bg-secondary border border-border rounded-lg mt-2 flex justify-between items-center">
          {chat.pdfName}
        </Button>
      )}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className='bg-secondary border-borde text-foreground p-4 rounded-lg mt-2 flex justify-between items-center border border-border'>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{chat.pdfName}</ModalHeader>
              <ModalBody> <img src={chat.thumbnailUrl || chat.pdfUrl} alt={chat.pdfName} className="object-cover rounded-lg"/></ModalBody>
              <ModalFooter>
                <Button className='bg-red-700 border rounded-md text-border' onPress={handleDelete}>Supprimer</Button>
                <Link href={`/dashboard/chat/${chat.id}`}>
                  <Button className='bg-orange-600 border rounded-md text-border' radius="sm">Ouvrir</Button>
                </Link>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default PDF