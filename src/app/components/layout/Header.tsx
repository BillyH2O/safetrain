import React from 'react'
import { LeftHeader } from './LeftHeader';
import { RightHeader } from './RightHeader';

export default function Header() {
  return (
    <header className="h-12 py-10 px-4">
      <div className="flex items-center justify-between h-full">
      <LeftHeader/>
      <RightHeader/>
      </div>
    </header>
  )
}