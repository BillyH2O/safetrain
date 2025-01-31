"use client";

import React from "react";
import { FileUpload } from "./FileUpload";
import {
  Modal,
  ModalContent,
  Button,
  useDisclosure,
} from "@nextui-org/react";

export const FileUploader = () => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
    <div className="relative"> 
      <div className="flex gap-5 items-center justify-end">
      <Button className="bg-primary text-white rounded-lg " size="lg" onPress={onOpen}>Upload</Button>
      </div>
      <Modal backdrop="opaque" classNames={{
          backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }} isOpen={isOpen} onOpenChange={onOpenChange} size="4xl" placement="center">
        <ModalContent>
          {() => (
            <>
              <div className="w-full h-full flex justify-center items-center mx-auto min-h-96 border border-dashed dark:bg-black dark:border-neutral-800 rounded-lg">
                <FileUpload />
              </div>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default FileUploader;



