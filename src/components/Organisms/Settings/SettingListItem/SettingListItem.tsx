import Link from 'next/link'
import React from 'react'
import { SlLock } from 'react-icons/sl'
import { BiChevronRight } from 'react-icons/bi'

interface SettingListItemProps {}

const SettingListItem = ({}: SettingListItemProps) => {
  return (
    <Link href={'/setting/changePassword'}>
      <div className="flex items-center px-4 py-3 rounded-xl bg-gray-100">
        <SlLock size={20} className="mr-3 text-gray-500" />
        <h6 className="block text-gray-500 flex-1">Change Password</h6>
        <BiChevronRight size={20} className="text-gray-500" />
      </div>
    </Link>
  )
}

export default SettingListItem
