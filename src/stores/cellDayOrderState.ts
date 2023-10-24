import { atom } from 'recoil'
import { OrderStateMentType, OrderStatus } from '@/types/cellday'

export const cellDayOrderState = atom<OrderStateMentType>({
  key: 'DALLANT/ORDER',
  default: {
    cellId: '',
    orderStatus: OrderStatus.NOT_SUBMITTED,
  },
})
