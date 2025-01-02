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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

type PdfProps = {
  chat: any,
  isEnabled: boolean,
}

const PDF = ({chat, isEnabled}: PdfProps) => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const queryClient = useQueryClient();
  const deleteChatMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await axios.delete(`/api/delete-chat/${id}`);
      return response.data;
    },
    onSuccess: () => {
      // Invalider le cache pour mettre à jour les données
      queryClient.invalidateQueries({
        queryKey: ["chats"],
      });
    },
  });

  const handleDelete = () => {
    deleteChatMutation.mutate(chat.id);
  };

  return (
    <div key={chat.id}>
      
      {isEnabled ? (
        <button onClick={onOpen} className="h-96">
          <img
            src={chat.thumbnailUrl || chat.pdfUrl}
            alt={chat.pdfName}
            className="h-full rounded-lg"
            
          />
        </button>
      ) : (
        <Button
          onPress={onOpen}
          className="bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg mt-2 flex justify-between items-center"
        >
          {chat.pdfName}
        </Button>
      )}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className='bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 p-4 rounded-lg mt-2 flex justify-between items-center'>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{chat.pdfName}</ModalHeader>
              <ModalBody>
              <img
                src={chat.thumbnailUrl || chat.pdfUrl}
                alt={chat.pdfName}
                className="object-cover rounded-lg"
              />
              </ModalBody>
              <ModalFooter>
                <Button className='bg-red-700 border rounded-md' onPress={handleDelete}>
                  Supprimer
                </Button>
                <Link href={`/dashboard/chat/${chat.id}`}>
                  <Button className='bg-orange-600 border rounded-md' radius="sm">Ouvrir</Button>
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