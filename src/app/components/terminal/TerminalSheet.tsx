import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/app/components/ui/sheet"  
  import { Button } from "@/app/components/ui/button/Button"
import { Terminal } from './Terminal'

export const TerminalSheet = () => {
  return (
    <Sheet>
        <SheetTrigger asChild>
            <Button variant="outline">Config</Button>
        </SheetTrigger>
        <SheetContent>
            <SheetHeader className='h-full'>
            <SheetTitle className="m-auto">Configuration du Terminal</SheetTitle>
            <SheetDescription className='h-full'>
                <Terminal isPlayground={false}/>
            </SheetDescription>
            </SheetHeader>
        </SheetContent>
    </Sheet>

  )
}