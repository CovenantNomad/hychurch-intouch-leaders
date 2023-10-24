import { Theme } from '@/types/setting'
import { atom } from 'recoil'

export const stateSetting = atom({
  key: 'MAIN/SETTING',
  default: {
    cellSelectedCategoryId: 0,
    dallantSelectedCategoryId: 0,
  },
})
