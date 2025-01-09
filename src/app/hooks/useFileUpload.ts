import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { uploadToS3 } from "../lib/s3";
import { useRouter } from "next/navigation";


export const useFileUpload = (onChange?: (files: File[]) => void) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const router = useRouter()
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async ({ file_key, file_name }: { file_key: string; file_name: string }) => {
      const response = await axios.post("/api/create-chat", { file_key, file_name });
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

      const data = await uploadToS3(file);

      if (!data?.file_key || !data?.file_name) {
        toast.error("L'objet data ne possède pas de clé ou de nom de fichier");
        return;
      }

      mutate(data, {
        onSuccess: ({chat_id}) => {
          queryClient.invalidateQueries({
            queryKey: ["chats"],
          });
          console.log("chat_id :", chat_id);
          toast.success("le chat a été crée");
          setUploading(false);
        },
        onError: () => {
          toast.error("Erreur lors de la création du chat");
        },
      });
    } catch (error) {
      console.error(error);
    } 
  };

  return {
    files,
    uploading,
    handleDrop,
  };
};
