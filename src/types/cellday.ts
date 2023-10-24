import { Timestamp } from 'firebase/firestore'

export enum OrderStatus {
  NOT_SUBMITTED = 'NOT_SUBMITTED',
  COMPLETE = 'COMPLETE',
}

export interface RestaurantType {
  restaurantId: string
  restaurantName: string
  ordered: string
  menu: MenuType[]
}

export interface MenuType {
  menuId: string
  menuName: string
  menuDescription?: string
  menuPrice: string
  menuImageUrl: string
}

export interface CartItemType {
  orderedMenuItem: MenuType
  itemQuantity: string
  itemPrice: string
}

export interface CartType {
  cartItems: CartItemType[]
  cartItemCount: string
  totalPrice: string
}

export interface OrderStateMentType {
  cellId: string
  orderStatus: OrderStatus
  orderNumber?: string
  orderDocument?: CartType
  orderTime?: Timestamp
}
