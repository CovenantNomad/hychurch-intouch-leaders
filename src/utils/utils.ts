import { UserCellTransferStatus } from '@/graphql/generated'
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
