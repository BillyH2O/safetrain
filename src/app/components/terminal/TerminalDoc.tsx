import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
  } from "@nextui-org/react";
  
  type TerminalDocProps = {
    label: string;
  };

  export default function TerminalDoc({ label }: TerminalDocProps) {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
  
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
                <ModalHeader className="flex flex-col gap-1">Les paramètres du modèle</ModalHeader>
                <ModalBody>
                <div className="flex flex-col gap-10">
                <p>
                <strong>Temperature</strong> : Ce paramètre contrôle la randomisation des résultats générés. Sa plage de valeurs va généralement de 0 à 1. Une température basse (proche de 0) rend les réponses plus déterministes et cohérentes, tandis qu’une température élevée (proche de 1) augmente la diversité et la créativité des réponses en introduisant davantage de hasard.
                </p>
                <p>
                <strong>topP</strong> : Ce paramètre ajuste la probabilité cumulative pour limiter le choix des mots générés. La plage de valeurs typique est de 0 à 1. Avec une valeur proche de 1, presque tous les mots sont considérés, tandis qu'une valeur basse restreint le choix aux mots les plus probables.
                </p>
                <p>
                <strong>topK</strong> : Ce paramètre fixe un nombre maximum de choix parmi les mots les plus probables. La plage de valeurs peut aller de 1 à 100 ou plus. Une valeur basse limite les options aux mots les plus probables, tandis qu'une valeur élevée permet plus de diversité.
                </p>
                <p>
                <strong>maxSteps</strong> : Ce paramètre détermine le nombre maximum d'étapes ou de tokens générés par l'algorithme. La plage de valeurs peut varier selon l'implémentation, mais elle est souvent comprise entre 50 et 1000. Une valeur plus élevée permet de générer des textes plus longs.
                </p>
                <p>
                <strong>stopSequences</strong> : Ce paramètre indique les séquences spécifiques où la génération doit s’arrêter. Par exemple, si « max » est défini comme séquence d'arrêt, l'algorithme interrompra la génération dès qu’il rencontrera cette séquence.
                </p>
                <p>
                <strong>Prompt</strong> : Il s'agit du texte d'entrée ou de départ que l'utilisateur fournit pour lancer la génération. Le modèle s'appuie sur ce prompt pour produire la suite du contenu.
                </p>
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
    );
  }
