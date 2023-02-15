import React, { Dispatch, SetStateAction } from 'react'
import Spacer from '../Spacer'

interface GridMenuProps {
  menuList: {
    id: number
    title: string
    icon: string
  }[]
  setSelected: Dispatch<SetStateAction<number>>
}

const GridMenu = ({ menuList, setSelected }: GridMenuProps) => {
  return (
    <div className="grid grid-cols-3">
      {menuList.map((menu) => (
        <div
          key={menu.id}
          className="inline-block text-center mr-6 cursor-pointer"
          onClick={() => setSelected(menu.id)}
        >
          <div className="flex items-center justify-center p-8 rounded-2xl shadow-lg bg-gray-50">
            <p className="text-3xl">{menu.icon}</p>
          </div>
          <Spacer size={'h-2'} />
          <div className="text-sm">{menu.title}</div>
        </div>
      ))}
    </div>
  )
}

export default GridMenu
