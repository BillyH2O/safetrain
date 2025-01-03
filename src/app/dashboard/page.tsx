import React from "react";
import FileUploader from "../components/uploader/FileUploader";
import { PDFList } from "../components/uploader/PDFList";

const DashboardPage = () => {
  return (
    <div className="h-full w-full p-10">
      <div>
        <FileUploader />
      </div>
      
      <PDFList />
    </div>
  );
};

export default DashboardPage;
