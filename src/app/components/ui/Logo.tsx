"use client";

import React from "react";
import Link from "next/link";
import SafetrainLogo from "../../../assets/safetrain-logo.png"
import Image from "next/image";

type LogoProps = {
  isClickable: boolean;
  size?: "xs" | "sm" | "ls" | "xl" | "xxl";
};

const sizeMap = {
  xs: { width: 25},
  sm: { width: 35},
  ls: { width: 40},
  xl: { width: 60},
  xxl: {width: 100}
};

const Logo = ({ isClickable, size = "sm" }: LogoProps) => {
  const { width } = sizeMap[size];

  const content = (
    <div
      className={`font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20 ${
        isClickable ? "cursor-pointer" : ""
      }`}
    >
      <div className="flex-shrink-0" style={{ width }}>
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
