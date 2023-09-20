import { Timestamp } from 'firebase/firestore'
import { Member } from './member'

// Firebase CELL Document
export interface DallantCellType {
  cellId: string
  cellName: string
  community: string
  totalAmount: number
}

// Firebase CELL Document with CELL - [MEMBER]
export interface DallantCellWithMemberType extends DallantCellType {
  members: DallantMemberType[]
}

// Firebase CELL - [MEMBER]
export interface DallantMemberType {
  userId: string
  userName: string
  totalAmount: number
}

// GraphQL MEMBER + Firebase MEMBER.TotalAmount
export interface DallantCellCombinedMember extends Member {
  totalAmount: number
}

// Firebase ACCOUNT Document
export interface DallantAccountType {
  cellId: string
  cellName: string
  userId: string
  userName: string
  totalAmount: number
}

// Firebase ACCOUNT Document with ACCOUNT - [HISTORY]
export interface DallantHistoryType {
  docId: string
  amount: number
  description: string
  createdAt: string
  createdTimestamp: Timestamp
  totalAmount: number
}

export interface UserDallantHeaderViewDataType extends DallantAccountType {
  isLeader: boolean
}
