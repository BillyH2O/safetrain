"use client"

import * as React from "react"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react"
import { modelParametersDoc } from "../../../data/doc"

type TerminalDocProps = {
  label: string
}

export default function TerminalDoc({ label }: TerminalDocProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  return (
    <>
      <Button color="warning" variant="flat" onPress={onOpen}>
        {label}
      </Button>
      <Modal
        backdrop="opaque"
        size={"3xl"}
        classNames={{
          body: "py-6",
          backdrop: "bg-[#2b1d0f]/50 backdrop-opacity-40",
          base: "border-[#2b1d0f] bg-[#1e140a] dark:bg-[#1e140a] text-[#d6a86d]",
          header: "border-b-[1px] border-[#2b1d0f]",
          footer: "border-t-[1px] border-[#2b1d0f]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
        isOpen={isOpen}
        radius="lg"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Les paramètres du modèle
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-10">
                  {modelParametersDoc.map(({ title, description }, index) => (
                    <p key={index}>
                      <strong>{title}</strong> : {description}
                    </p>
                  ))}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="warning" variant="light" onPress={onClose}>
                  Fermé
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
