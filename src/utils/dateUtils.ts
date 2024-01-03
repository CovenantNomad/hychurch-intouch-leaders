import dayjs from 'dayjs'

export const getTodayString = (date: dayjs.Dayjs) => {
  //yyyy-MM-dd
  return `${date.year()}-${(date.month() + 1)
    .toString()
    .padStart(2, '0')}-${date.date().toString().padStart(2, '0')}`
}

export const convertSecondToDate = (seconds: number) => {
  return dayjs(seconds * 1000)
}

//가장 최근 주일 구하기
export function getMostRecentSunday() {
  const today = dayjs()
  const currentDayOfWeek = today.day() // 0은 일요일, 1은 월요일, ..., 6은 토요일

  if (currentDayOfWeek === 0) {
    return today
  }

  // 현재 요일을 뺌으로써 이번 주 일요일까지의 날짜를 구함
  const mostRecentSunday = today.subtract(currentDayOfWeek, 'day')

  return mostRecentSunday
}

export const formatTimeDifference = (time: number) => {
  const days = Math.floor(time / (24 * 60 * 60))
  const hours = Math.floor((time % (24 * 60 * 60)) / (60 * 60))
  const minutes = Math.floor((time % (60 * 60)) / 60)
  const seconds = time % 60

  // return `${days}일 ${hours}시간 ${minutes}분 ${seconds}초`;

  return {
    days,
    hours,
    minutes,
    seconds,
  }
}
