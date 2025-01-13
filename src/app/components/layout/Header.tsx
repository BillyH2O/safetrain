import React from 'react'
import { SignInButton, SignedIn, SignedOut} from '@clerk/nextjs'
import { LeftHeader } from './LeftHeader';
import { RightHeader } from './RightHeader';


type Props = {}

const Header = (props: Props) => {
  return (
    <div className="h-12 py-10 px-4">
        <SignedOut>
            <SignInButton />
        </SignedOut>
        <SignedIn>
        <div className='flex items-center justify-between h-full'>
            <LeftHeader/>
            <RightHeader/>
            </div>
        </SignedIn>
        </div>
  )
}

export default Header