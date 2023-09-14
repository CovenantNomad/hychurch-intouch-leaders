import React from 'react'
import { DallantCellCombinedMember } from '@/types/dallant'
import { RoleType } from '@/graphql/generated'
import Link from 'next/link'

interface CellDallantListItemProps {
  member: DallantCellCombinedMember
}

const CellDallantListItem = ({ member }: CellDallantListItemProps) => {
  return (
    <Link
      href={{
        pathname: `/dallants/members/${member.id}`,
        query: {
          userName: member.name,
          isLeader: member.roles.includes(RoleType.CellLeader),
          totalAmount: member.totalAmount,
        },
      }}
      as={`/dallants/members/${member.id}`}
    >
      <div
        className={`flex flex-col py-6 px-10 rounded-xl ${
          member.roles.includes(RoleType.CellLeader)
            ? 'bg-[#4EBCB3]'
            : 'bg-[#9FB2DA]'
        }`}
      >
        <div className="flex items-center gap-x-3">
          <div className="w-8 h-8 flex justify-center items-center bg-gray-100/20 rounded-full">
            <span className="font-serif font-black text-lg text-white">I</span>
          </div>
          <p className="text-lg font-sans text-gray-800">{member.name}</p>
        </div>
        <div className="text-right pt-5 pb-2">
          <p className="text-2xl font-sans font-bold text-gray-800">
            {member.totalAmount.toLocaleString('kr-KR')} D{' '}
          </p>
        </div>
      </div>
    </Link>
  )
}

export default CellDallantListItem
