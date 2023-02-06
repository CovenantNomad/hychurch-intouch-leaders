import React from 'react'

interface SpacerProps {
  size?: string
  background?: boolean
}

const Spacer = ({ background, size = 'h-8' }: SpacerProps) => {
  return <div className={`${size} ${background ? 'bg-white' : 'bg-inherit'}`} />
}

export default Spacer
