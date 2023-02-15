import { Gender, RoleType } from '@/graphql/generated'

export interface Member {
  id: string
  name: string
  phone: string
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
