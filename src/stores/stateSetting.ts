import { Theme } from '@/types/setting'
import { atom } from 'recoil'

export const stateSetting = atom({
  key: 'MAIN/SETTING',
  default: {
    theme: Theme.default,
    cellSelectedCategoryId: 0,
  },
})
