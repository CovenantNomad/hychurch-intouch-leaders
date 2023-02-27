import { LoginUser } from '@/types/auth'
import { atom } from 'recoil'

export const stateUserInfo = atom<LoginUser | null>({
  key: 'MAIN/USER_INFO',
  default: null,
})
