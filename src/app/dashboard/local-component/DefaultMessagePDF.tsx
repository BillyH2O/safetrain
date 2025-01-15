import React from "react";
import { BackgroundBeams } from "../../components/ui/background/background-beams";
import FileUploader from "./FileUploader";

export const DefaultPDFMessage = () => {

  return (
    <div className="h-full w-full rounded-md relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-2xl mx-auto p-4 flex flex-col items-center justify-center gap-12 z-10">
        <h1 className="relative text-lg md:text-7xl text-foreground opacity-85 bg-gradient-to-b text-center ">
          Uploadez votre premier PDF
        </h1>
        {/*<p className="text-neutral-500 max-w-lg mx-auto my-2 text-sm text-center relative">
          Accédez au chat et découvrez les fonctionnalités de notre Agent Autonome
        </p>*/}
        <FileUploader />
      </div>
      <BackgroundBeams/>
    </div>
  );
  
};
