import { Loader2 } from 'lucide-react'
import React from 'react'

type Props = {
    label?: string
}

export const LoadingPage = ({label = "Chargement des données ..."}: Props) => {
  return (
    <div className='w-full h-full flex flex-col justify-center items-center gap-3'>
        <Loader2 className="h-10 w-10 text-primary animate-spin"/>
        <p>{label}</p>
    </div>
  )
}