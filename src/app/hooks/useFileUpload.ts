import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { uploadToS3 } from "../lib/s3";
import { useRouter } from "next/navigation";
import { useChatSettings } from "../components/context/ChatContext";
import { startUiTimer, stopUiTimer } from "../lib/utils";

export const useFileUpload = (onChange?: (files: File[]) => void) => {
  const [files, setFiles] = useState<File[]>([]);
  const { embeddingModel } = useChatSettings();
  const router = useRouter()
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const uiIntervalRef = useRef<NodeJS.Timeout | null>(null); // référence pour stocker l'intervalle du timer UI
  
  useEffect(() => {
    return () => {
      if (uiIntervalRef.current) {
        stopUiTimer(uiIntervalRef.current);
      }
    };
  }, []);

  
  const handleStartUiTimer = () => {
    if (uiIntervalRef.current) {
      stopUiTimer(uiIntervalRef.current);
    }
    uiIntervalRef.current = startUiTimer(setCurrentStepIndex, 7, 1000);
  };

  const handleStopUiTimer = () => {
    if (uiIntervalRef.current) {
      stopUiTimer(uiIntervalRef.current);
      uiIntervalRef.current = null;
    }
    setCurrentStepIndex(0); 
  };

  const { mutate } = useMutation({
    mutationFn: async ({ file_key, file_name, embeddingModel }: { file_key: string; file_name: string; embeddingModel: string | undefined}) => {
      const response = await axios.post("/api/create-chat", { file_key, file_name, embeddingModel});
      return response.data;
    },
  });

  const handleDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Fichier trop volumineux (10 Mb max)");
      return;
    }

    try {
      setUploading(true);
      handleStartUiTimer();

      const data = await uploadToS3(file);

      if (!data?.file_key || !data?.file_name) {
        toast.error("L'objet data ne possède pas de clé ou de nom de fichier");
        setUploading(false);
        handleStopUiTimer();
        return;
      }

      mutate({
        file_key: data.file_key,
        file_name: data.file_name,
        embeddingModel: embeddingModel, 
      }, {
        onSuccess: ({chat_id}) => {
          queryClient.invalidateQueries({
            queryKey: ["chats"],
          });
          console.log("chat_id :", chat_id);
          toast.success("le chat a été crée");          
          setUploading(false);
          handleStopUiTimer();
        },
        onError: () => {
          toast.error("Erreur lors de la création du chat");
          setUploading(false);
          handleStopUiTimer();
        },
      });
    } catch (error) {
      console.error(error);
      setUploading(false);
      handleStopUiTimer();
    } 
  };

  return {
    files,
    uploading,
    handleDrop,
    currentStepIndex,
  };
};
