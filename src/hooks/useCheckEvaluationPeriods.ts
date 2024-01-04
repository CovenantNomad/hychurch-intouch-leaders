import { getEvalutationSettings } from '@/firebase/evaluation/evaluation'
import { formatTimeDifference } from '@/utils/dateUtils'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

export enum EntryDateStatusCode {
  NOTSTARTED = 'notStarted',
  COMPLETED = 'completed',
}

export type TCountDown = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export const useCheckEvaluationPeriods = () => {
  const today = dayjs()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [statusCode, setStatusCode] = useState<EntryDateStatusCode | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [countDown, setCountDown] = useState<TCountDown | null>(null)
  const [entryStartDate, setEntryStartDate] = useState<
    dayjs.Dayjs | undefined
  >()
  const [entryEndDate, setEntryEndDate] = useState<dayjs.Dayjs | undefined>()
  const [viewingStartDate, setViewingStartDate] = useState<
    dayjs.Dayjs | undefined
  >()
  const [viewingEndDate, setViewingEndDate] = useState<
    dayjs.Dayjs | undefined
  >()

  const {
    isLoading: isSettingLoading,
    isFetching: isSettingFetching,
    data,
  } = useQuery({
    queryKey: ['getEvalutationSettings'],
    queryFn: getEvalutationSettings,
    staleTime: 60 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  })

  useEffect(() => {
    if (isSettingLoading || isSettingFetching) {
      setIsLoading(true)
    } else {
      setIsLoading(false)
    }

    if (data) {
      setEntryStartDate(
        data.entryPeriod.from
          ? dayjs(data.entryPeriod.from.seconds * 1000)
          : undefined
      )
      setEntryEndDate(
        data.entryPeriod.to
          ? dayjs(data.entryPeriod.to.seconds * 1000)
          : undefined
      )
      setViewingStartDate(
        data.viewingPeriod.from
          ? dayjs(data.viewingPeriod.from.seconds * 1000)
          : undefined
      )
      setViewingEndDate(
        data.viewingPeriod.to
          ? dayjs(data.viewingPeriod.to.seconds * 1000)
          : undefined
      )
    }
  }, [isSettingLoading, isSettingFetching, message, data])

  const updateEntryCountdown = ({
    currentDate,
    startDate,
    targetDate,
  }: {
    currentDate: dayjs.Dayjs
    startDate: dayjs.Dayjs
    targetDate: dayjs.Dayjs
  }) => {
    if (currentDate.isBefore(startDate)) {
      setStatusCode(EntryDateStatusCode.NOTSTARTED)
      setMessage('아직 셀원정보 입력기간 전입니다')
      setCountDown(null)
    } else if (currentDate.isAfter(targetDate)) {
      setStatusCode(EntryDateStatusCode.COMPLETED)
      setMessage('셀원정보 입력기간이 지났습니다')
      setCountDown(null)
    } else {
      const timeDifference = targetDate.diff(currentDate, 'second')
      const { days, hours, minutes, seconds } =
        formatTimeDifference(timeDifference)
      setCountDown({
        days,
        hours,
        minutes,
        seconds,
      })
    }
  }

  return {
    today,
    isLoading,
    isActive: data?.isActive,
    seasonName: data?.seasonName,
    entryStartDate,
    entryEndDate,
    viewingStartDate,
    viewingEndDate,
    statusCode,
    message,
    countDown,
    updateEntryCountdown,
  }
}
