import { atom } from 'recoil'
import { LoginUser } from 'src/types/auth'

export const stateUserInfo = atom<LoginUser | null>({
  key: 'MAIN/USER_INFO',
  default: null,
})
