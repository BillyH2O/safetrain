import React from 'react'
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Bell } from 'lucide-react'
import Image from 'next/image';
import CYtechLogo from "../../assets/cy-logo.png";
import SafetrainLogo from "../../assets/safetrain-logo.png";
import TokenLogo from "../../assets/token-logo.png";
import GemmeLogo from "../../assets/gemme-logo.png";

type Props = {}

const Header = (props: Props) => {
  return (
    <div className="h-12 py-10 px-4">
        <SignedOut>
            <SignInButton />
        </SignedOut>
        <SignedIn>
        <div className='flex items-center justify-between h-full'>
            <div className='flex justify-center items-center gap-10'>
                <div className='flex justify-center items-center gap-5'>
                    <Image src={SafetrainLogo} alt="logo open ai" height={35}/>
                    <h2 className='antialiased text-xl font-mono'>Safetrain IA</h2>
                </div>
                <Image src={CYtechLogo} alt="logo open ai" height={35}/>
            </div>
            <div className='flex justify-center items-center gap-10'>
                <Image src={GemmeLogo} alt="logo open ai" height={35}/>
                <Image src={TokenLogo} alt="logo open ai" height={35}/>
                <Bell color='grey' />
                <UserButton
                    appearance={{
                        elements: {
                        userButtonAvatarBox: {
                            width: "48px",
                            height: "48px",
                            "& img": {
                            width: "100%",
                            height: "100%",
                            },
                        },
                        },
                    }}
                    />
            </div>
            </div>
        </SignedIn>
        </div>
  )
}

export default Header