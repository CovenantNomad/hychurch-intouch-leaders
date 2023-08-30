import React, { Dispatch, Fragment, SetStateAction, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ArrowsRightLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'
import dayjs from 'dayjs'
import { getTodayString } from '@/utils/dateUtils'

interface SearchFilterModalProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  now: dayjs.Dayjs
  datefilter: {
    min: string
    max: string
  }
  setDateFilter: React.Dispatch<
    React.SetStateAction<{
      min: string
      max: string
    }>
  >
}

const SearchFilterModal = ({
  open,
  setOpen,
  now,
  datefilter,
  setDateFilter,
}: SearchFilterModalProps) => {
  // const [manual, setManual] = useState(false)
  const onClickSetTodayHandler = () => {
    setDateFilter({
      ...datefilter,
      min: getTodayString(now),
    })
    setOpen(false)
  }

  const onClickSetOneMonthHandler = () => {
    setDateFilter({
      ...datefilter,
      min: getTodayString(now.subtract(1, 'month')),
    })
    setOpen(false)
  }

  const onClickSetThreeMonthHandler = () => {
    setDateFilter({
      ...datefilter,
      min: getTodayString(now.subtract(3, 'month')),
    })
    setOpen(false)
  }

  const onClickSetSixMonthHandler = () => {
    setDateFilter({
      ...datefilter,
      min: getTodayString(now.subtract(6, 'month')),
    })
    setOpen(false)
  }

  const onClickSetOneYearHandler = () => {
    setDateFilter({
      ...datefilter,
      min: getTodayString(now.subtract(1, 'year')),
    })
    setOpen(false)
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative w-full transform overflow-hidden rounded-lg bg-white px-4 pt-6 pb-7 text-left shadow-xl transition-all sm:my-8 sm:max-w-lg sm:p-6 lg:px-12">
                <div>
                  <div className="flex justify-between items-center">
                    <p className="text-xl">조회기간 설정</p>
                    <XMarkIcon
                      className="h-8 w-8 text-gray-500 cursor-pointer"
                      aria-hidden="true"
                      onClick={() => setOpen(false)}
                    />
                  </div>
                  <div className="mt-6">
                    <p className="text-sm text-gray-500">기간선택</p>
                    <div className="grid grid-cols-5 mt-2">
                      <button
                        type="button"
                        className="col-span-1 py-2 border-t border-b border-l hover:bg-gray-100"
                        onClick={onClickSetTodayHandler}
                      >
                        오늘
                      </button>
                      <button
                        type="button"
                        className="col-span-1 py-2 border-t border-b border-l hover:bg-gray-100"
                        onClick={onClickSetOneMonthHandler}
                      >
                        1개월
                      </button>
                      <button
                        type="button"
                        className="col-span-1 py-2 border-t border-b border-l hover:bg-gray-100"
                        onClick={onClickSetThreeMonthHandler}
                      >
                        3개월
                      </button>
                      <button
                        type="button"
                        className="col-span-1 py-2 border-t border-b border-l hover:bg-gray-100"
                        onClick={onClickSetSixMonthHandler}
                      >
                        6개월
                      </button>
                      <button
                        type="button"
                        className="col-span-1 py-2 border-t border-b border-l border-r hover:bg-gray-100"
                        onClick={onClickSetOneYearHandler}
                      >
                        12개월
                      </button>
                      {/* <button 
                        type='button'
                        className='col-span-1 py-2 border-t border-b border-l border-r hover:bg-gray-100'
                        onClick={() => setManual(!manual)}
                      >
                        직접입력
                      </button> */}
                    </div>
                    {/* {manual && (
                      <div className='flex justify-around mt-2 py-2 border'>
                        <div className='flex gap-x-4'>
                          <p>{datefilter.min.replaceAll("-", ".")}</p>
                          <button>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                            </svg>
                          </button>
                        </div>
                        <p>~</p>
                        <div className='flex gap-x-4'>
                          <p>{datefilter.max.replaceAll("-", ".")}</p>
                          <button>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )} */}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default SearchFilterModal
