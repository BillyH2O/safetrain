"use client";

import React, { useState } from "react";
import { FileUpload } from "./FileUpload";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Switch,
} from "@nextui-org/react";

const MainUploader = () => {
  const handleFileUpload = (newFiles: File[]) => {
    // Gérer la logique de l'upload
    console.log("files dashboard", newFiles);
  };

  const [isEnabled, setIsEnabled] = useState(false);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const handleSwitchChange = () => {
    setIsEnabled((prev) => !prev); // Inverse la valeur actuelle
    console.log("isEnabled", isEnabled);
  };

  return (
    <div className="relative"> 
      <div className="flex gap-5 items-center justify-end">
      <Button className="dark:bg-black dark:border-neutral-800 rounded-lg " size="lg" onPress={onOpen}>Upload</Button>
      </div>
      <div className="mb-4">
      </div>
      <Modal backdrop="opaque" classNames={{
          backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }} isOpen={isOpen} onOpenChange={onOpenChange} size="4xl" placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <div className="w-full h-full flex justify-center items-center mx-auto min-h-96 border border-dashed dark:bg-black dark:border-neutral-800 rounded-lg">
                <FileUpload onChange={handleFileUpload} />
              </div>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default MainUploader;



