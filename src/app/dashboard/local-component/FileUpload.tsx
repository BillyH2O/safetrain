import {cn}  from "../../lib/utils";
import React, { useRef } from "react";
import { motion } from "framer-motion";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import { useFileUpload } from "@/app/hooks/useFileUpload";
import { GridPattern } from "./GridPattern";
import { MultiStepLoader as Loader } from "./multi-step-loader";

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

const loadingStates = [
  // Partie S3
  { text: "Génération de la miniature..." },
  { text: "Upload AWS S3..." },
  // Partie Pinecone
  { text: "Chunking..." },
  { text: "Génération index BM25..." },
  { text: "Vectorisation du document..." },
  { text: "Upload sur Pinecone..." },
  { text: "Finalisation..." },
];


export const FileUpload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { uploading, handleDrop, currentStepIndex } = useFileUpload();
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
        'application/pdf': ['.pdf'],
      },
    maxFiles : 2,
    multiple: true,
    noClick: false,
    onDrop: handleDrop,
    onDropRejected: (error) => {
      console.log(error);
    },
  });

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className="p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden"
      >
        <input {...getInputProps()} />
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
          <GridPattern />
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="relative z-20 font-sans font-bold text-neutral-700 dark:text-neutral-300 text-base">
            Uploadez votre PDF
          </p>
          <p className="relative z-20 font-sans font-normal text-neutral-400 dark:text-neutral-400 text-base mt-2">
            Drag & drop votre fichier ici ou cliquez sur le bouton
          </p>

          {uploading ? (
            <div className="mt-10 flex flex-col justify-center items-center gap-6">
              {/*<Loader2 className="h-10 w-10 text-sky-400 animate-spin"/>*/}
              <Loader
                loadingStates={loadingStates}
                loading={uploading}
                duration={100}
                currentStepIndex={currentStepIndex}
              />
              <p className="text-sm text-slate-200">
                {loadingStates[currentStepIndex]?.text}
              </p>
            </div>
          ) : (
          <div className="relative w-full mt-10 max-w-xl mx-auto">
              <motion.div
                layoutId="file-upload"
                variants={mainVariant}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className={cn(
                  "relative group-hover/file:shadow-2xl z-40 bg-white dark:bg-neutral-900 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md",
                  "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                )}
              >
                {isDragActive ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-neutral-600 flex flex-col items-center"
                  >
                    Droppez le
                    <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                  </motion.p>
                ) : (
                  <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                )}
              </motion.div>
            
              <motion.div
                variants={secondaryVariant}
                className="absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md"
              ></motion.div>
            
          </div>
          )}
          
        </div>
      </motion.div>
    </div>
  );
};
