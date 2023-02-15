import React, { Dispatch, SetStateAction } from 'react'
import Spacer from '../Spacer'

interface HorizontalScrollMenuProps {
  menuList: {
    id: number
    title: string
    icon: string
  }[]
  setSelected: Dispatch<SetStateAction<number>>
}

const HorizontalScrollMenu = ({
  menuList,
  setSelected,
}: HorizontalScrollMenuProps) => {
  return (
    <div className="overflow-x-auto overflow-y-hidden whitespace-nowrap py-2 ">
      {menuList.map((menu) => (
        <div
          key={menu.id}
          className="inline-block text-center mr-6"
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

export default HorizontalScrollMenu
