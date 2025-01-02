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

type Props = {chat: any}

const PDF = ({chat}: Props) => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  return (
    <div key={chat.id}>
      <Button onPress={onOpen} className='className="w-[500px] h-[100px] bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 p-4 rounded-lg mt-2 flex justify-between items-center"'>{chat.pdfName}</Button>
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
                <Button color="danger" variant="light" onPress={onClose}>
                  Fermer
                </Button>
                <Link href={`/dashboard/chat/${chat.id}`} className="bg-orange-600 border rounded-md" >
                  <Button radius="sm">Ouvrir</Button>
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