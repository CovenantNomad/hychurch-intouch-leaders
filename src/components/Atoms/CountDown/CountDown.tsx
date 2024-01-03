import { TCountDown } from '@/hooks/useCheckEvaluationPeriods'
import React from 'react'

type CountDownProps = {
  countDown: TCountDown
  isHidden: boolean
}

const CountDown = ({ isHidden, countDown }: CountDownProps) => {
  return (
    <div
      className={`${
        isHidden ? 'hidden' : 'flex'
      } justify-center gap-x-4 mt-4 lg:mt-6`}
    >
      <div className="flex items-end">
        <div className="flex justify-center items-center w-12 h-12 border border-gray-100 shadow-md">
          <span className="text-2xl font-bold">{countDown.days}</span>
        </div>
        <span className="ml-1 text-sm text-gray-400">일</span>
      </div>
      <div className="flex items-end">
        <div className="flex justify-center items-center w-12 h-12 border border-gray-100 shadow-md">
          <span className="text-2xl font-bold">{countDown.hours}</span>
        </div>
        <span className="ml-1 text-sm text-gray-400">시</span>
      </div>
      <div className="flex items-end">
        <div className="flex justify-center items-center w-12 h-12 border border-gray-100 shadow-md">
          <span className="text-2xl font-bold">{countDown.minutes}</span>
        </div>
        <span className="ml-1 text-sm text-gray-400">분</span>
      </div>
      <div className="flex items-end">
        <div className="flex justify-center items-center w-12 h-12 border border-gray-100 shadow-md">
          <span className="text-2xl font-bold">{countDown.seconds}</span>
        </div>
        <span className="ml-1 text-sm text-gray-400">초</span>
      </div>
    </div>
  )
}

export default CountDown
