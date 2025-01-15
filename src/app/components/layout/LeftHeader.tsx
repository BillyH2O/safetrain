import React from 'react'
import Image from 'next/image';
import Logo from '../ui/Logo';
import CYtechLogo from "../../../assets/cy-logo.png";

type Props = {}

export const LeftHeader = (props: Props) => {
  return (
    <div className='flex justify-center items-center gap-10'>
        <div className='flex justify-center items-center gap-5'>
            <Logo isClickable={true} size='ls'/>
            <div className="font-medium text-black dark:text-white whitespace-pre antialiased text-xl font-mono">SafeTrain IA</div>
        </div>
        <Image src={CYtechLogo} alt="logo open ai" height={35}/>
    </div>
  )
}