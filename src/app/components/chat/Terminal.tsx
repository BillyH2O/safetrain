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
import { ConfigTerminal } from '../terminal/ConfigTerminal'

type Props = {}

const Terminal = (props: Props) => {
  return (
    <Sheet>
        {/* Sans asChild : SheetTrigger rend un bouton interne automatiquement. En passant un autre bouton à l’intérieur, tu crées une imbrication de boutons, ce qui cause l’erreur.
            Avec asChild : SheetTrigger n’ajoute plus de bouton interne, mais utilise directement le bouton que tu lui passes (<Button variant="outline"></Button>*/}
        <SheetTrigger asChild>
            <Button variant="outline">Config</Button>
        </SheetTrigger>
        <SheetContent>
            <SheetHeader className='h-full'>
            <SheetTitle className="sr-only">Configuration du Terminal</SheetTitle>
            <SheetDescription className='h-full'>
                <ConfigTerminal isPlayground={false}/>
            </SheetDescription>
            </SheetHeader>
        </SheetContent>
    </Sheet>

  )
}

export default Terminal;