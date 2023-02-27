import Button from '@/components/Atoms/Buttons/Button'
import React from 'react'

interface ButtonGroupProps {
  items: {
    id: number
    name: string
    onClick: () => void
    outline?: boolean
  }[]
}

const ButtonGroup = ({ items }: ButtonGroupProps) => {
  return (
    <div className="flex space-x-3">
      {items.map((item) => (
        <Button
          key={item.id}
          onClick={item.onClick}
          outline={item.outline || false}
        >
          {item.name}
        </Button>
      ))}
    </div>
  )
}

export default ButtonGroup
