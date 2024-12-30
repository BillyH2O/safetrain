"use client";

import React, { useState, useEffect } from "react";
import DashboardLoader from "./DashboardLoader";
import { UploadedFilesList } from "../uploader/UploadFilesList";
import { FileUpload } from "../uploader/FileUpload";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [files, setFiles] = useState<File[]>([]);
  const [tempFiles, setTempFiles] = useState<File[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (tempFiles.length > 0) {
      setFiles(tempFiles);
    }
  }, [tempFiles]);

  const handleFileUpload = (newFiles: File[]) => {
    // S'assurer que la mise à jour de l'état est asynchrone 
    // En retardant l'appel de onChange avec un setTimeout, on s'assure que le rendu initial de FileUpload est complètement terminé avant que React ne tente de maj le parent Dashboard.
    setTimeout(() => {
      setTempFiles(newFiles);
      console.log("files dashboard", newFiles);
    }, 0);
  };

  if (isLoading) {
    return <DashboardLoader />;
  }

  return (
    <div className="flex flex-1">
      <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
        <div className="w-full max-w-4xl flex justify-center item mx-auto min-h-96 border border-dashed dark:bg-black dark:border-neutral-800 rounded-lg">
          <FileUpload onChange={handleFileUpload} />
        </div>
        <UploadedFilesList files={files} />
      </div>
    </div>
  );
};

export default Dashboard;
