import Avatar, { AvatarSize } from '@/components/Atoms/Avatar'
import LinkButton from '@/components/Atoms/Buttons/LinkButton'
import React from 'react'

interface ListItemProps {
  userId: string
  title: string
  subtitle: string
  text: string
}

const ListItem = ({ userId, title, subtitle, text }: ListItemProps) => {
  const nameCheck = /^[a-zA-Z]*$/
  return (
    <div className="flex items-center py-4">
      <Avatar
        size={AvatarSize.md}
        name={title.substring(
          nameCheck.test(title) ? title.length - 3 : title.length - 2
        )}
      />
      <div className="ml-2">
        <p className="font-bold">{title}</p>
        <p className="text-gray-400">{subtitle}</p>
      </div>
      <p>{text}</p>
      <div>
        <LinkButton />
      </div>
    </div>
  )
}

export default ListItem
