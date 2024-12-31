import React from "react";
import MainUploader from "../components/uploader/MainUploader";
import { UploadedFilesList } from "../components/uploader/UploadFilesList";

const DashboardPage = () => {
  return (
    <div className="flex flex-1 h-full justify-center items-center flex-col p-4 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
      
      <div className="w-full max-w-4xl flex justify-center items-center mx-auto min-h-96 border border-dashed dark:bg-black dark:border-neutral-800 rounded-lg mb-8">
        <MainUploader />
      </div>
      
      <UploadedFilesList />
    </div>
  );
};

export default DashboardPage;
