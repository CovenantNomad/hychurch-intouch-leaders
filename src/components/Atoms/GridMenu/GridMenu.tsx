import React from 'react'
import { useRecoilState } from 'recoil'
import { stateSetting } from '@/stores/stateSetting'
import Spacer from '../Spacer'

interface GridMenuProps {
  menuList: {
    id: number
    title: string
    icon: string
  }[]
  onSelectHandler: (id: number) => void
}

const GridMenu = ({ menuList, onSelectHandler }: GridMenuProps) => {
  return (
    <div className="grid grid-cols-4">
      {menuList.map((menu) => (
        <div
          key={menu.id}
          className="inline-block text-center mr-6 cursor-pointer"
          onClick={() => onSelectHandler(menu.id)}
        >
          <div className="flex items-center justify-center p-4 rounded-2xl shadow-lg bg-gray-50 lg:p-6">
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
