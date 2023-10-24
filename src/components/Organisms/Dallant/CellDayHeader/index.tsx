import React, { useState } from 'react'
import { classNames } from '@/utils/utils'
import { ShoppingBagIcon } from '@heroicons/react/24/outline'
import { useRecoilValue } from 'recoil'
import { cellDayCartState } from '@/stores/cellDayCartState'

interface CellDayHeaderProps {
  tabIdx: number
  setTabIdx: React.Dispatch<React.SetStateAction<number>>
}

const tabs = [
  {
    id: 0,
    name: '메뉴',
  },
  {
    id: 1,
    name: '주문현황',
  },
  {
    id: 2,
    name: '공지사항',
  },
]

const CellDayHeader = ({ tabIdx, setTabIdx }: CellDayHeaderProps) => {
  const { cartItemCount } = useRecoilValue(cellDayCartState)

  return (
    <div className="flex  justify-between items-center border-b border-gray-200 px-4 md:px-6 lg:px-8">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab, index) => (
          <a
            key={tab.id}
            onClick={() => setTabIdx(index)}
            className={classNames(
              tab.id === tabIdx
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
              'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
            )}
            aria-current={tab.id === tabIdx ? 'page' : undefined}
          >
            {tab.name}
          </a>
        ))}
      </nav>
      <div>
        <button onClick={() => setTabIdx(3)} className="flex items-center">
          <ShoppingBagIcon className="h-6 w-6" />
          {cartItemCount ? (
            <span
              className={
                'ml-2 rounded-full py-1.5 px-2.5 text-xs font-medium bg-gray-100 text-gray-900 md:inline-block'
              }
            >
              {cartItemCount}
            </span>
          ) : null}
        </button>
      </div>
    </div>
  )
}

export default CellDayHeader
