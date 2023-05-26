import { Disclosure } from '@headlessui/react'
import React from 'react'
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai'

const members = [
  {
    id: '1',
    value: '1',
    label: '노아',
    checked: false,
    isOline: false,
  },
  { id: '2', value: '2', label: '이삭', checked: false, isOline: false },
  { id: '3', value: '3', label: '야곱', checked: false, isOline: false },
  { id: '4', value: '4', label: '요셉', checked: false, isOline: false },
  { id: '5', value: '5', label: '모세', checked: false, isOline: false },
  {
    id: '6',
    value: '6',
    label: '여호수아',
    checked: false,
    isOline: false,
  },
]

interface AttendanceFormProps {}

const ServiceForm = ({}: AttendanceFormProps) => {
  return (
    <Disclosure as="div" className="border-t border-gray-200 px-4 py-6">
      {({ open }) => (
        <>
          <h3 className="-mx-2 -my-3 flow-root">
            <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
              <span className="font-medium text-gray-900">제목</span>
              <span className="ml-6 flex items-center">
                {open ? (
                  <AiOutlineMinus width={20} height={20} />
                ) : (
                  <AiOutlinePlus width={20} height={20} />
                )}
              </span>
            </Disclosure.Button>
          </h3>
          <Disclosure.Panel className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-6 lg:gap-x-16">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <input
                      id={`${member.id}`}
                      type="checkbox"
                      defaultChecked={false}
                      value={member.id}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label className="ml-3 min-w-0 flex-1 text-gray-500">
                      {member.label}
                    </label>
                  </div>
                  {/* <Toggle value={value} onChange={onChange} /> */}
                </div>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}

export default ServiceForm
