import React from "react";
import MainUploader from "../components/uploader/MainUploader";
import { UploadedFilesList } from "../components/uploader/UploadFilesList";

const DashboardPage = () => {
  return (
    <div className="h-full w-full p-10">
      <div>
        <MainUploader />
      </div>
      
      <UploadedFilesList />
    </div>
  );
};

export default DashboardPage;
