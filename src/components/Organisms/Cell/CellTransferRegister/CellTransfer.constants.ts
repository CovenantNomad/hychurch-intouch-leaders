import { UserGrade } from '@/graphql/generated'
import { SelectType } from '@/types/common'

export const EMPTY_SELECT: SelectType = { id: '', name: '' }

export const TAB = {
  OTHER_CELL: 0,
  RENEW_CELL: 1,
} as const

export type TabType = (typeof TAB)[keyof typeof TAB]

export const InActiveUserGradeList = [
  { id: UserGrade.D, name: 'D등급 (연락두절/장기결석자)' },
  { id: UserGrade.E, name: 'E등급 (예배만 참석)' },
  { id: UserGrade.F, name: 'F등급 (이사)' },
]

export const convertUserGrade = (gradeId: string): UserGrade => {
  if (!(gradeId in UserGrade)) {
    throw new Error(`Invalid UserGrade: ${gradeId}`)
  }

  return UserGrade[gradeId as keyof typeof UserGrade]
}
