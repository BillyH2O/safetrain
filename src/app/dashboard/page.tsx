import React from "react";
import FileUploader from "./local-component/FileUploader";
import { PDFList } from "./local-component/PDFList";

const DashboardPage = () => {
  return (
    <div className="h-full w-full"> 
      <PDFList />
    </div>
  );
};

export default DashboardPage;
