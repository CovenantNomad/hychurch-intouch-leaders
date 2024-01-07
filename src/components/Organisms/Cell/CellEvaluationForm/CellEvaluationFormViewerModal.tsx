import React, { Dispatch, Fragment, SetStateAction } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { IndividualEvaluationDataType } from '@/types/evalutation'
import EmptyStateSimple from '@/components/Atoms/EmptyStates/EmptyStateSimple'
import { textViewForFirebaseText } from '@/utils/utils'

type CellEvaluationFormViewerModalProps = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  data: IndividualEvaluationDataType | null | undefined
}

const CellEvaluationFormViewerModal = ({
  data,
  open,
  setOpen,
}: CellEvaluationFormViewerModalProps) => {
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
              <Dialog.Panel className="relative w-full transform overflow-hidden rounded-lg bg-white px-4 pb-7 pt-6 text-left shadow-xl transition-all sm:max-w-lg">
                <div className="absolute right-0 top-0 hidden pr-4 pt-6 sm:block sm:z-10">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-1"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                {data ? (
                  <div className="">
                    <div className="mt-3 sm:mt-0">
                      <div className="pb-6">
                        <Dialog.Title
                          as="h3"
                          className="relative text-base font-semibold leading-6 text-gray-900"
                        >
                          {data.userName} 셀원정보
                          <span className="absolute right-0 bottom-0 text-sm font-normal text-gray-500 lg:mr-10">
                            (이전셀: {data.previousCellName})
                          </span>
                        </Dialog.Title>
                      </div>
                      {/* 예배출석 */}
                      <div className="flex justify-between mt-2 py-2 px-1 border rounded-md sm:px-2 sm:py-3">
                        <span className="block text-sm text-gray-800 font-semibold">
                          예배출석
                        </span>
                        <span className="text-sm text-gray-500">
                          {data.worship}
                        </span>
                      </div>
                      {/* 셀모임출석 */}
                      <div className="flex justify-between mt-2 py-2 px-1 border rounded-md sm:px-2 sm:py-3">
                        <span className="block text-sm text-gray-800 font-semibold">
                          셀모임출석
                        </span>
                        <span className="text-sm text-gray-500">
                          {data.meeting}
                        </span>
                      </div>
                      {/* 셀원소개 */}
                      <div className="mt-4">
                        <span className="block text-sm text-gray-800 font-semibold pl-1 sm:pl-2">
                          셀원소개
                        </span>
                        <div className="p-1 mt-1 border rounded-md sm:p-2">
                          <p className="text-sm text-gray-900 whitespace-pre-line">
                            {textViewForFirebaseText(data.description)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="px-10">
                    <EmptyStateSimple />
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default CellEvaluationFormViewerModal
