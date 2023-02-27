import { classNames } from '@/utils/utils'
import React, { Dispatch, SetStateAction } from 'react'

interface TabsProps {
  tabs: {
    id: number
    title: string
  }[]
  tabIdx: number
  setSelect: Dispatch<SetStateAction<number>>
}

const Tabs = ({ tabs, tabIdx, setSelect }: TabsProps) => {
  return (
    <nav
      className="isolate flex divide-x divide-gray-200 rounded-lg shadow"
      aria-label="Tabs"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setSelect(tab.id)}
          aria-current={tab.id === tabIdx ? 'page' : undefined}
          className={classNames(
            tab.id === tabIdx
              ? 'text-gray-900'
              : 'text-gray-500 hover:text-gray-700',
            tabIdx === 0 ? 'rounded-l-lg' : '',
            tabIdx === tabs.length - 1 ? 'rounded-r-lg' : '',
            'group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-6 text-sm font-medium text-center hover:bg-gray-50 focus:z-10'
          )}
        >
          <span>{tab.title}</span>
          <span
            aria-hidden="true"
            className={classNames(
              tab.id === tabIdx ? 'bg-teal-500' : 'bg-transparent',
              'absolute inset-x-0 bottom-0 h-0.5'
            )}
          />
        </button>
      ))}
    </nav>
  )
}

export default Tabs
