import Avatar, { AvatarSize } from '@/components/Atoms/Avatar'
import LinkButton from '@/components/Atoms/Buttons/LinkButton'
import ListSubTitleText from '@/components/Atoms/Typography/ListSubTitleText'
import ListTitleText from '@/components/Atoms/Typography/ListTitleText'
import { Gender } from '@/graphql/generated'
import Link from 'next/link'
import React from 'react'
import { IoIosPhonePortrait } from 'react-icons/io'

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
  birthday,
  phone,
}: CellMemberListItemProps) => {
  const nameCheck = /^[a-zA-Z]*$/
  return (
    <div className="flex items-center py-4 border-b cursor-pointer">
      <Avatar
        size={AvatarSize.md}
        name={name.substring(
          nameCheck.test(name) ? name.length - 3 : name.length - 2
        )}
        rounded
      />
      <div className="ml-4 flex-1">
        <ListTitleText>
          {name} {gender === 'MAN' ? '형제' : '자매'}
        </ListTitleText>
        <ListSubTitleText>{phone}</ListSubTitleText>
      </div>
      <Link href={`/cell/members/${name}`}>
        <button className="inline-flex items-center rounded-full border border-gray-300 bg-white px-2.5 py-0.5 text-sm font-medium leading-5 text-gray-700 shadow-sm hover:bg-gray-50">
          View
        </button>
      </Link>
    </div>
  )
}

export default CellMemberListItem
