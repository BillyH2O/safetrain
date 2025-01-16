import { Button } from '@nextui-org/react'
import { Trash } from 'lucide-react'
import React from 'react'

export const DeleteButton = () => {
  return (
    <Button size='sm' isIconOnly color="danger" startContent={<Trash className='w-4' />} variant="bordered" className="p-1"></Button>
  )
}