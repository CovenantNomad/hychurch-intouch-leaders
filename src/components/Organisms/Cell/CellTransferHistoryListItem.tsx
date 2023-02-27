import React from 'react'
import { TransferedUserType } from '@/types/member'
import { getTransferStatus } from '@/utils/utils'
import { UserCellTransferStatus } from '@/graphql/generated'
import ListSubTitleText from '@/components/Atoms/Typography/ListSubTitleText'
import ListTitleText from '@/components/Atoms/Typography/ListTitleText'

interface CellTransferHistoryListItemProps {
  member: TransferedUserType
}

const CellTransferHistoryListItem = ({
  member,
}: CellTransferHistoryListItemProps) => {
  return (
    <div className="w-full grid grid-cols-12 items-center py-3 px-2 border-b border-b-gray-300">
      <div className="col-span-3 lg:col-span-4">
        <p className="text-base">{member.user.name}</p>
      </div>
      <div className="col-span-3 lg:col-span-2">
        <p>{member.fromCell.name}</p>
        <ListSubTitleText>From</ListSubTitleText>
      </div>
      <div className="col-span-3 lg:col-span-2">
        <p>{member.toCell.name}</p>
        <ListSubTitleText>To</ListSubTitleText>
      </div>
      <div className="hidden lg:block lg:col-span-2">
        <p className="inline-block text-sm text-center px-3 py-1 rounded-md bg-gray-200">
          {member.status === UserCellTransferStatus.Ordered
            ? member.orderDate
            : member.completeDate}
        </p>
      </div>
      <div className="col-span-3 text-center lg:col-span-2">
        <p
          className={`inline-block w-20 text-sm text-center py-1 rounded-3xl ${
            member.status === UserCellTransferStatus.Confirmed
              ? 'bg-teal-100 text-teal-600'
              : member.status === UserCellTransferStatus.Canceled
              ? 'bg-red-100 text-red-400'
              : 'bg-yellow-100 text-yellow-600'
          }`}
        >
          {getTransferStatus(member.status)}
        </p>
      </div>
    </div>
  )
}

export default CellTransferHistoryListItem
