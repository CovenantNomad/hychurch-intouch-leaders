import React, { useEffect, useState } from 'react'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/20/solid'
import Skeleton from '@/components/Atoms/Skeleton'
import CountDown from '@/components/Atoms/CountDown/CountDown'
import {
  EntryDateStatusCode,
  TCountDown,
} from '@/hooks/useCheckEvaluationPeriods'
import dayjs from 'dayjs'
import ShutdownAlert from '@/components/Blocks/EvaluationForm/ShutdownAlert/ShutdownAlert'
import DurationAlertCard from '@/components/Blocks/EvaluationForm/\bDurationAlertCard'

type CellEvaluationFormEntryHeaderProps = {
  isLoading: boolean
  isActive: boolean | undefined
  today: dayjs.Dayjs
  entryStartDate: dayjs.Dayjs | undefined
  entryEndDate: dayjs.Dayjs | undefined
  statusCode: EntryDateStatusCode | null
  message: string | null
  countDown: TCountDown | null
  updateEntryCountdown: ({
    currentDate,
    startDate,
    targetDate,
  }: {
    currentDate: dayjs.Dayjs
    startDate: dayjs.Dayjs
    targetDate: dayjs.Dayjs
  }) => void
}

const CellEvaluationFormEntryHeader = ({
  isLoading,
  isActive,
  today,
  entryStartDate,
  entryEndDate,
  statusCode,
  message,
  countDown,
  updateEntryCountdown,
}: CellEvaluationFormEntryHeaderProps) => {
  const [hidden, setHidden] = useState(true)

  useEffect(() => {
    let entryTimer: NodeJS.Timeout | undefined

    if (entryStartDate && entryEndDate) {
      entryTimer = setInterval(() => {
        updateEntryCountdown({
          currentDate: today,
          startDate: entryStartDate,
          targetDate: entryEndDate,
        })
      }, 1000)
    }

    return () => {
      if (entryTimer) {
        clearInterval(entryTimer)
      }
    }
  }, [entryStartDate, entryEndDate, today])

  return (
    <div>
      {isLoading ? (
        <div>로딩중...</div>
      ) : (
        <>
          {isActive ? (
            <div>
              {statusCode === null ? (
                <>
                  {countDown ? (
                    <>
                      <DurationAlertCard
                        title="셀원정보 입력기간입니다"
                        typeText="입력기간"
                        startDate={entryStartDate}
                        endDate={entryEndDate}
                        hasTimer={true}
                        hidden={hidden}
                        setHidden={setHidden}
                      />
                      <CountDown isHidden={hidden} countDown={countDown} />
                    </>
                  ) : (
                    <>
                      <Skeleton className="h-[105px] lg:h-[72px] bg-gray-100" />
                    </>
                  )}
                </>
              ) : (
                <>
                  {message ? (
                    <>
                      {statusCode === EntryDateStatusCode.COMPLETED && (
                        <div className="rounded-md bg-green-50 p-4">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <CheckCircleIcon
                                className="h-5 w-5 text-green-400"
                                aria-hidden="true"
                              />
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-green-800">
                                입력기간 종료
                              </h3>
                              <div className="mt-2 text-sm text-green-700">
                                <p>{message}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {statusCode === EntryDateStatusCode.NOTSTARTED && (
                        <div className="rounded-md bg-yellow-50 p-4">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <ExclamationTriangleIcon
                                className="h-5 w-5 text-yellow-400"
                                aria-hidden="true"
                              />
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-yellow-800">
                                입력기간 이전
                              </h3>
                              <div className="mt-2 text-sm text-yellow-700">
                                <p>{message}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <Skeleton className="h-[105px] lg:h-[72px] rounded-md bg-gray-100" />
                  )}
                </>
              )}
            </div>
          ) : (
            <ShutdownAlert
              title="셀 편성 기간이 아닙니다."
              subtitleOne="셀평가서는 셀 편성 기간에만 작성합니다"
              subtitleTwo="셀원정보 입력시 입력기한을 꼭 준수해주세요"
            />
          )}
        </>
      )}
    </div>
  )
}

export default CellEvaluationFormEntryHeader
