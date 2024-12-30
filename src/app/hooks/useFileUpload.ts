import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { uploadToS3 } from "../lib/s3";


export const useFileUpload = (onChange?: (files: File[]) => void) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const { mutate } = useMutation({
    mutationFn: async ({ file_key, file_name }: { file_key: string; file_name: string }) => {
      const response = await axios.post("/api/create-chat", { file_key, file_name });
      return response.data;
    },
  });

  const handleFileChange = (newFiles: File[]) => {
    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles, ...newFiles];
      if (onChange) {
        setTimeout(() => onChange(updatedFiles), 0);
      }
      return updatedFiles;
    });
  };

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
        onSuccess: (response) => {
          toast.success(response.message);
          handleFileChange(acceptedFiles);
        },
        onError: () => {
          toast.error("Erreur lors de la création du chat");
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return {
    files,
    uploading,
    handleDrop,
  };
};
