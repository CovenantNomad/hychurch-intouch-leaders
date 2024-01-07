import { UserCellTransferStatus } from '@/graphql/generated'
import { TempSavedAttendanceHistory } from '@/types/attendance'
import { Member } from '@/types/member'

export function groupBy(list: Member[]) {
  let init: { [index: string]: Member[] } = {}
  return list.reduce((acc, cur: Member) => {
    const { birthday } = cur
    const year = birthday?.split('-')[0] || '1900'
    acc[year] ? acc[year].push(cur) : (acc[year] = [cur])
    return acc
  }, init)
}

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export function makeErrorMessage(message: string) {
  return message.split(':')[0]
}

export const getTransferStatus = (state: UserCellTransferStatus) => {
  switch (state) {
    case UserCellTransferStatus.Ordered:
      return '승인대기'

    case UserCellTransferStatus.Canceled:
      return '거절'

    case UserCellTransferStatus.Confirmed:
      return '승인완료'

    default:
      break
  }
}

export const getServiceName = (churchServiceId: string) => {
  const churchServiceNameList = [
    '1부예배',
    '2부예배',
    '3부예배',
    '4부예배',
    '청년예배',
  ]
  return churchServiceNameList[Number(churchServiceId) - 1]
}

export function groupByChurchService(list: TempSavedAttendanceHistory[]) {
  let init: {
    serviceId: string
    tempAttendanceList: TempSavedAttendanceHistory[]
  }[] = [
    { serviceId: '1', tempAttendanceList: [] },
    { serviceId: '2', tempAttendanceList: [] },
    { serviceId: '3', tempAttendanceList: [] },
    { serviceId: '4', tempAttendanceList: [] },
    { serviceId: '5', tempAttendanceList: [] },
  ]
  return list.reduce((acc, cur: TempSavedAttendanceHistory) => {
    const { churchServiceId } = cur
    const index = acc.findIndex((item) => item.serviceId === churchServiceId)
    acc[index].tempAttendanceList.push(cur)
    return acc
  }, init)
}

export const textForFirebase = (text: string) => {
  return text.replace(/\n/g, '\\n')
}

export const textViewForFirebaseText = (text: string) => {
  return text.replaceAll('\\n', '\n')
}
