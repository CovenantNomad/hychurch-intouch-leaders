import { atom } from 'recoil'
import { CartType } from '@/types/cellday'

export const cellDayCartState = atom<CartType>({
  key: 'DALLANT/CART',
  default: {
    cartItems: [],
    cartItemCount: '0',
    totalPrice: '0',
  },
})
