import Avatar, { AvatarSize } from '@/components/Atoms/Avatar'
import ListTitleText from '@/components/Atoms/Typography/ListTitleText'
import Link from 'next/link'
import React from 'react'

type CellLeaderListItemProps = {
  userId: string
  name: string
}

const CellLeaderListItem = ({ name, userId }: CellLeaderListItemProps) => {
  return (
    <div className="flex items-center py-4 cursor-pointer">
      <Avatar size={AvatarSize.md} name={name} rounded />
      <div className="ml-4 flex-1">
        <ListTitleText>{name}</ListTitleText>
      </div>
      <Link href={`/cell/members/${userId}`} shallow={true}>
        <button className="inline-flex items-center rounded-full border border-gray-300 bg-white px-2.5 py-0.5 text-sm font-medium leading-5 text-gray-700 shadow-sm hover:bg-gray-50">
          View
        </button>
      </Link>
    </div>
  )
}

export default CellLeaderListItem
