import React, { useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { GraphQLError } from 'graphql'
import { useQueryClient } from '@tanstack/react-query'
import graphlqlRequestClient from '@/client/graphqlRequestClient'
import {
  UserCellTransferStatus,
  useUpdateUserCellTransferMutation,
} from '@/graphql/generated'
import { TransferedUserType } from '@/types/member'
import { getTransferStatus, makeErrorMessage } from '@/utils/utils'

interface CellTransferAcceptListItemProps {
  member: TransferedUserType
}

const CellTransferAcceptListItem = ({
  member,
}: CellTransferAcceptListItemProps) => {
  const queryClient = useQueryClient()

  const { mutate } = useUpdateUserCellTransferMutation(graphlqlRequestClient, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['findCell'] })
      queryClient.invalidateQueries({ queryKey: ['findMyCellMembers'] })
      queryClient.invalidateQueries({
        queryKey: ['findUserCellTransferRegister'],
      })
      queryClient.invalidateQueries({
        queryKey: ['findUserCellTransferRequest'],
      })
      queryClient.invalidateQueries({
        queryKey: ['findUserCellTransferResult'],
      })
      toast.success(`이동요청이 승인 되었습니다`)
    },
    onError(errors: GraphQLError) {
      console.log(errors)
      toast.error(
        `이동요청이 실패했습니다.\n${makeErrorMessage(errors.message)}`
      )
    },
  })

  const onConfirmHandler = useCallback(
    (id: string) => {
      mutate({
        input: {
          id,
          status: UserCellTransferStatus.Confirmed,
        },
      })
    },
    [mutate]
  )

  const onCanceledHandler = useCallback(
    (id: string) => {
      mutate({
        input: {
          id,
          status: UserCellTransferStatus.Canceled,
        },
      })
    },
    [mutate]
  )

  return (
    <div className="bg-white flex flex-col py-4 px-6 rounded-lg shadow-md border">
      <div className="flex items-center">
        <div className="flex flex-col flex-1 items-start">
          <div className="flex items-center">
            <h4 className="text-xl font-bold cursor-pointer">
              {member.user.name}
            </h4>
            <span className="inline-block text-gray-500 text-sm ml-2 self-end">
              {member.user.gender === 'MAN' ? '형제' : '자매'}
            </span>
          </div>
          <div className="flex flex-col justify-start">
            <p className="text-base mt-2">
              <span>{member.fromCell.name}</span>
              <span className="inline-block px-2">→</span>
              <span>{member.toCell.name}</span>
            </p>
          </div>
        </div>
        <p className="text-base">{member.orderDate}</p>
      </div>
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => onCanceledHandler(member.id)}
          className="flex-1 bg-gray-100 text-gray-500 px-6 py-2 rounded-md cursor-pointer"
        >
          거절
        </button>
        <button
          onClick={() => onConfirmHandler(member.id)}
          className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          승인
        </button>
      </div>
    </div>
  )
}

export default CellTransferAcceptListItem
