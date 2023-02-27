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
}

const GridMenu = ({ menuList }: GridMenuProps) => {
  const [setting, setSetting] = useRecoilState(stateSetting)
  return (
    <div className="grid grid-cols-3">
      {menuList.map((menu) => (
        <div
          key={menu.id}
          className="inline-block text-center mr-6 cursor-pointer"
          onClick={() =>
            setSetting({ ...setting, cellSelectedCategoryId: menu.id })
          }
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
