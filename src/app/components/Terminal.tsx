import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/app/components/ui/sheet"  
  import { Button } from "@/app/components/ui/button"
import { ConfigTerminal } from './ConfigTerminal'

type Props = {}

const Terminal = (props: Props) => {
  return (
    <Sheet>
        <SheetTrigger>
            <Button variant="outline">Config</Button>
        </SheetTrigger>
        <SheetContent>
            <SheetHeader>
            <SheetTitle>Terminal Safetrain IA</SheetTitle>
            <SheetDescription>
                <ConfigTerminal isPlayground={false}/>
            </SheetDescription>
            </SheetHeader>
        </SheetContent>
    </Sheet>

  )
}

export default Terminal;