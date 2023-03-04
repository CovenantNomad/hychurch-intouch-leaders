import Avatar, { AvatarSize } from '@/components/Atoms/Avatar'
import ListSubTitleText from '@/components/Atoms/Typography/ListSubTitleText'
import ListTitleText from '@/components/Atoms/Typography/ListTitleText'
import { Gender } from '@/graphql/generated'
import Link from 'next/link'
import React from 'react'

interface CellMemberListItemProps {
  userId: string
  name: string
  gender: Gender
  birthday: string
  phone: string
}

const CellMemberListItem = ({
  userId,
  name,
  gender,
  phone,
}: CellMemberListItemProps) => {
  return (
    <div className="flex items-center py-4 border-b cursor-pointer">
      <Avatar size={AvatarSize.md} name={name} rounded />
      <div className="ml-4 flex-1">
        <ListTitleText>
          {name} {gender === 'MAN' ? '형제' : '자매'}
        </ListTitleText>
        <ListSubTitleText>{phone}</ListSubTitleText>
      </div>
      <Link href={`/cell/members/${userId}`} shallow={true}>
        <button className="inline-flex items-center rounded-full border border-gray-300 bg-white px-2.5 py-0.5 text-sm font-medium leading-5 text-gray-700 shadow-sm hover:bg-gray-50">
          View
        </button>
      </Link>
    </div>
  )
}

export default CellMemberListItem
