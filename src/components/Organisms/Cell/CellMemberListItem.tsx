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
    <Link href={`/cell/members/${name}`}>
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
          <ListSubTitleText>{birthday}</ListSubTitleText>
        </div>
        <div className="flex items-center gap-x-2">
          <IoIosPhonePortrait size={15} />
          <p>{phone}</p>
        </div>
      </div>
    </Link>
  )
}

export default CellMemberListItem
