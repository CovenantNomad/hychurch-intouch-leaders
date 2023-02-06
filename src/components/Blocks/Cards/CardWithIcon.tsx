import React from 'react'
//components
import Spacer from '@components/Atoms/Spacer'

interface CardWithIconProps {
  bg: string
  icon: string
  title: string
}

const CardWithIcon = ({ bg, icon, title }: CardWithIconProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 rounded-3xl ${bg}`}
    >
      <div className="w-12 h-12 bg-white flex justify-center items-center rounded-full">
        <span className="text-xl">{icon}</span>
      </div>
      <Spacer size={'h-2'} />
      <p className="text-base tracking-wide text-[#333]">{title}</p>
    </div>
  )
}

export default CardWithIcon
