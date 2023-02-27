import { RoleType } from '@/graphql/generated'

export interface LoginForm {
  phone: string
  password: string
}

export interface LoginUser {
  id: string
  name: string
  cell?:
    | {
        id: string
        name: string
      }
    | null
    | undefined
  roles: RoleType[]
}
