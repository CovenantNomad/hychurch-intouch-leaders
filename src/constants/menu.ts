import { StepStatus } from '@/types/common'

export interface menuType {
  id: number
  title: string
  icon: string
  color: string
  pathname: string
}

export const mainMenu: menuType[] = [
  {
    id: 0,
    title: '출석체크',
    icon: '⏱️',
    color: '#FDF4E2',
    pathname: '/attendance',
  },
  {
    id: 1,
    title: '셀보고서',
    icon: '📝',
    color: '#EDF5E1',
    pathname: '/reports',
  },
  {
    id: 2,
    title: '셀원관리',
    icon: '⛪️',
    color: '#CAEAF3',
    pathname: '/cell',
  },
  {
    id: 3,
    title: '설문조사',
    icon: '✍️',
    color: '#F9E8E5',
    pathname: '/survey',
  },
]

export const cellMenu = [
  {
    id: 0,
    title: '셀 정보',
    icon: '🔖',
  },
  {
    id: 1,
    title: '셀원 정보',
    icon: '🗃️',
  },
  {
    id: 2,
    title: '셀원 이동',
    icon: '✈️',
  },
]

export const cellTransferTabs = [
  { id: 0, title: '이동신청' },
  { id: 1, title: '이동승인' },
  { id: 2, title: '이동결과' },
]

export const AttendanceSteps = [
  { id: 0, title: '출석체크' },
  { id: 1, title: '검토' },
]
