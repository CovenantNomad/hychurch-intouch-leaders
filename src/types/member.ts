import {
  Gender,
  RoleType,
  UserCellTransferStatus,
  UserGrade,
} from '@/graphql/generated'

export type Member = {
  id: string
  name: string
  phone: string
  grade: UserGrade
  isActive: boolean
  birthday?: string | null | undefined
  gender?: Gender | null | undefined
  address?: string | null | undefined
  cell?:
    | {
        id: string
        name: string
      }
    | null
    | undefined
  roles: RoleType[]
  description?: string | null | undefined
}

export interface TransferedUserType {
  id: string
  status: UserCellTransferStatus
  orderDate: string
  completeDate?: string | null | undefined
  fromCell: {
    id: string
    name: string
  }
  toCell: {
    id: string
    name: string
  }
  user: {
    id: string
    name: string
    gender?: Gender | null | undefined
  }
}
