"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import SafetrainLogo from "../../../assets/safetrain-logo.png"
import Image from "next/image";

type LogoProps = {
  isClickable: boolean;
  size?: "sm" | "ls" | "xl";
};

const sizeMap = {
  sm: { width: 35},
  ls: { width: 40},
  xl: { width: 60},
};

const Logo = ({ isClickable, size = "sm" }: LogoProps) => {
  const { width } = sizeMap[size];

  const content = (
    <div
      className={`font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20 ${
        isClickable ? "cursor-pointer" : ""
      }`}
    >
      <div className="flex-shrink-0 mr-3" style={{ width }}>
        <Image
          src={SafetrainLogo}
          alt="SafeTrain Logo"
          className="rounded-lg"
          layout="responsive"
          width={width}
        />
      </div>
    </div>
  );

  return isClickable ? (
    <Link href="/" passHref>
      {content}
    </Link>
  ) : (
    content
  );
};

export default Logo;
