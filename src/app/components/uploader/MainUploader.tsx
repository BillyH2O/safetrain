"use client";

import React from "react";
import { FileUpload } from "./FileUpload";

const MainUploader = () => {
  const handleFileUpload = (newFiles: File[]) => {
    // Gérer la logique de l'upload
    console.log("files dashboard", newFiles);
  };

  return (
    <div className="w-full max-w-4xl flex justify-center items-center mx-auto min-h-96 border border-dashed dark:bg-black dark:border-neutral-800 rounded-lg">
      <FileUpload onChange={handleFileUpload} />
    </div>
  );
};

export default MainUploader;
