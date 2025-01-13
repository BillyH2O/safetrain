import React from "react";
import FileUploader from "./local-component/FileUploader";
import { PDFManager } from "./local-component/PDFManager";

const DashboardPage = () => {
  return (
    <div className="h-full w-full"> 
      <PDFManager />
    </div>
  );
};

export default DashboardPage;
