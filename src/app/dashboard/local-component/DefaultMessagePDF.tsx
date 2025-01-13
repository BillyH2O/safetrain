import React from "react";
import { cn } from "@/app/lib/utils";
import { BackgroundBeams } from "../../components/ui/background/background-beams";
import FileUploader from "./FileUploader";
import { FileUpload } from "./FileUpload";


type DefaultPDFMessageProps = {
  variant?: "large" | "small";
};

export const DefaultPDFMessage = ({variant = "large"}: DefaultPDFMessageProps) => {
  const titleClasses =
    variant === "large"
      ? "text-2xl w-[65%]"
      : "text-2xl sm:text-3xl lg:text-4xl w-[70%]";

  return (
    <div className="h-full w-full rounded-md relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-2xl mx-auto p-4 flex flex-col items-center justify-center gap-12 z-10">
        <h1 className="relative  text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
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
