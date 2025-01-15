import { Button } from '@nextui-org/react'
import { Trash } from 'lucide-react'
import React from 'react'

type Props = {}

export const DeleteButton = (props: Props) => {
  return (
    <Button size='sm' isIconOnly color="danger" startContent={<Trash className='w-4' />} variant="bordered" className="p-1"></Button>
  )
}