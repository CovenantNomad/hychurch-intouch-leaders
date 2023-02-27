import dayjs from 'dayjs'

export const getTodayString = (date: dayjs.Dayjs) => {
  //yyyy-MM-dd
  return `${date.year()}-${(date.month() + 1)
    .toString()
    .padStart(2, '0')}-${date.date().toString().padStart(2, '0')}`
}
