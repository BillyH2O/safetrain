import React from 'react'
import { Bell } from 'lucide-react'
import Image from 'next/image';
import TokenLogo from "../../../assets/token-logo.png";
import GemmeLogo from "../../../assets/gemme-logo.png";
import { UserButton } from '@clerk/nextjs';

type Props = {}

export const RightHeader = (props: Props) => {
  return (
    <div className='flex justify-center items-center gap-10'>
        <Image src={TokenLogo} alt="logo open ai" height={35}/>
        <Bell color='grey' />
        <UserButton
            appearance={{
                elements: {
                userButtonAvatarBox: {width: "48px", height: "48px", "& img": {width: "100%", height: "100%",},},
                },
            }}/>
    </div>
  )
}