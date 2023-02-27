import React, { Dispatch, SetStateAction, useState } from 'react'
import { Combobox } from '@headlessui/react'
import { GoCheck, GoChevronDown } from 'react-icons/go'
import { classNames } from '@/utils/utils'
import { SelectType } from '@/types/common'

interface ComboBoxImageProps {
  label: string
  selected: SelectType
  setSelected: Dispatch<SetStateAction<SelectType>>
  selectList: SelectType[]
}

const ComboBoxImage = ({
  label,
  selected,
  setSelected,
  selectList,
}: ComboBoxImageProps) => {
  const [query, setQuery] = useState('')
  const filteredItem =
    query === ''
      ? selectList
      : selectList.filter((item) => {
          return item.name.toLowerCase().includes(query.toLowerCase())
        })

  return (
    <Combobox as="div" value={selected} onChange={setSelected}>
      <Combobox.Label className="block text-sm font-medium text-gray-700">
        {label}
      </Combobox.Label>
      <div className="relative mt-1">
        <Combobox.Input
          className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(item: { id: string; name: string }) => item.name}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <GoChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Combobox.Button>

        {filteredItem.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredItem.map((item) => (
              <Combobox.Option
                key={item.id}
                value={item}
                className={({ active }) =>
                  classNames(
                    'relative cursor-default select-none py-2 pl-3 pr-9',
                    active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <div className="flex items-center">
                      <span
                        className={classNames(
                          'ml-3 truncate',
                          selected ? 'font-semibold' : 'font-normal'
                        )}
                      >
                        {item.name}
                      </span>
                    </div>

                    {selected && (
                      <span
                        className={classNames(
                          'absolute inset-y-0 right-0 flex items-center pr-4',
                          active ? 'text-white' : 'text-indigo-600'
                        )}
                      >
                        <GoCheck className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  )
}

export default ComboBoxImage
