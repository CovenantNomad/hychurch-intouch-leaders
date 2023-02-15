import { Member } from '@/types/member'

export default function groupBy(list: Member[]) {
  let init: { [index: string]: Member[] } = {}
  return list.reduce((acc, cur: Member) => {
    const { birthday } = cur
    const year = birthday?.split('-')[0] || '1900'
    acc[year] ? acc[year].push(cur) : (acc[year] = [cur])
    return acc
  }, init)
}
