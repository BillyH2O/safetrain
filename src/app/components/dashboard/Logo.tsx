"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import SafetrainLogo from "../../../assets/safetrain-logo.png";
import Image from "next/image";

const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-7 w-7 flex-shrink-0">
        <Image
          src={SafetrainLogo}
          alt="SafeTrain Logo"
          className="rounded-lg"
          layout="responsive"
          width={28} // Adjust as needed
          height={28} // Adjust as needed
        />
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        SafeTrain IA
      </motion.span>
    </Link>
  );
};

export default Logo;
