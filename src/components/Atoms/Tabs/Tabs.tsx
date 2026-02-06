import { classNames } from '@/utils/utils'
import { Dispatch, SetStateAction } from 'react'

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
      className="isolate flex divide-x divide-gray-200 border border-gray-200 rounded-lg  overflow-hidden"
      aria-label="Tabs"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === tabIdx

        return (
          <button
            key={tab.id}
            onClick={() => setSelect(tab.id)}
            className={classNames(
              'relative flex-1 px-6 py-3 text-sm font-medium transition',
              isActive
                ? 'bg-white text-teal-600'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            <span className="whitespace-pre-line lg:whitespace-nowrap">
              {tab.title}
            </span>
            <span
              aria-hidden="true"
              className={classNames(
                isActive ? 'bg-teal-500' : 'bg-transparent',
                'absolute inset-x-0 bottom-0 h-0.5'
              )}
            />
          </button>
        )
      })}
    </nav>
  )
}

export default Tabs
