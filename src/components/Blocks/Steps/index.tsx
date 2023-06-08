import React, { Dispatch, SetStateAction } from 'react'
import { BsCheckLg } from 'react-icons/bs'
import { StepStatus } from '@/types/common'

interface StepsProps {
  steps: {
    id: number
    title: string
  }[]
  stepIdx: number
  setSelect: Dispatch<SetStateAction<number>>
}

const Steps = ({ steps, stepIdx, setSelect }: StepsProps) => {
  return (
    <nav>
      <ol className="flex rounded-md border border-gray-300">
        {steps.map((step) => (
          <li key={step.id} className={'relative flex flex-1'}>
            {step.id < stepIdx ? (
              <div className="group w-full flex items-center">
                <span className="flex flex-col items-center px-6 py-4 gap-y-1 text-sm font-medium md:flex-row md:gap-y-0">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-teal-500 group-hover:bg-teal-700">
                    <BsCheckLg width={24} height={24} color={'#fff'} />
                  </span>
                  <span className="text-sm font-medium text-gray-900 md:flex-row md:ml-4">
                    {step.title}
                  </span>
                </span>
              </div>
            ) : step.id === stepIdx ? (
              <div
                className="group w-full flex flex-col items-center justify-center gap-y-1 -ml-2 px-6 py-4 text-sm font-medium md:flex-row md:gap-y-0 md:-ml-0 md:justify-start"
                aria-current="step"
              >
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-teal-600">
                  <span className="text-teal-600">{step.id + 1}</span>
                </span>
                <span className="text-sm font-medium text-teal-500 md:ml-4">
                  {step.title}
                </span>
              </div>
            ) : (
              <div className="group w-full flex items-center justify-center gap-y-1 -ml-2 text-sm font-medium md:flex-row md:justify-start md:gap-y-0 md:-ml-0 ">
                <span className="flex flex-col items-center px-6 py-4 gap-y-1 text-sm font-medium md:flex-row md:gap-y-0">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 group-hover:border-gray-400">
                    <span className="text-gray-500 group-hover:text-gray-900">
                      {step.id + 1}
                    </span>
                  </span>
                  <span className="text-sm font-medium text-gray-500 group-hover:text-gray-900 md:ml-4 ">
                    {step.title}
                  </span>
                </span>
              </div>
            )}
            {step.id !== steps.length - 1 ? (
              <>
                {/* Arrow separator for lg screens and up */}
                <div
                  className="absolute top-0 right-0 h-full w-5"
                  aria-hidden="true"
                >
                  <svg
                    className="h-full w-full text-gray-300"
                    viewBox="0 0 22 80"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 -2L20 40L0 82"
                      vectorEffect="non-scaling-stroke"
                      stroke="currentcolor"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default Steps
