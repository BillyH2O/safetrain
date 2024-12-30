import React from "react";

export const UploadedFilesList = ({ files }: { files: File[] }) => {
  return (
    <div className="mt-24 flex justify-center items-center gap-5 flex-wrap overflow-y-scroll">
      {files.map((file, idx) => (
        <div
          key={`uploaded-${idx}`}
          className="w-[500px] h-[100px] bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 p-4 rounded-lg mt-2 flex justify-between items-center"
        >
          <p className="text-sm text-neutral-700 dark:text-neutral-300 truncate max-w-xs">
            {file.name}
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {(file.size / (1024 * 1024)).toFixed(2)} MB
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            modifié le {new Date(file.lastModified).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};
