import { InformationCircleIcon } from '@heroicons/react/20/solid'
import dayjs from 'dayjs'
import React, { Dispatch, SetStateAction } from 'react'

type DurationAlertCardProps = {
  title: string
  typeText: string
  startDate: dayjs.Dayjs | undefined
  endDate: dayjs.Dayjs | undefined
  hasTimer?: boolean
  hidden?: boolean
  setHidden?: Dispatch<SetStateAction<boolean>>
}

const DurationAlertCard = ({
  title,
  typeText,
  startDate,
  endDate,
  hasTimer,
  hidden,
  setHidden,
}: DurationAlertCardProps) => {
  return (
    <div className="rounded-md bg-blue-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <InformationCircleIcon
            className="h-5 w-5 text-blue-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <p className="text-sm text-blue-700 whitespace-pre-line">
            {`${title}
            (${typeText}: ${startDate?.format(
              'YYYY-MM-DD'
            )} ~ ${endDate?.format('YYYY-MM-DD')})`}
          </p>
          {hasTimer && setHidden && hidden && (
            <button
              onClick={() => setHidden(!hidden)}
              className="mt-3 text-sm md:ml-6 md:mt-0 whitespace-nowrap font-medium text-blue-700 hover:text-blue-600 cursor-pointer"
            >
              {hidden ? '타이머 보기' : '타이머 숨기기'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default DurationAlertCard
