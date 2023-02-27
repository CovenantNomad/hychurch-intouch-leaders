import graphlqlRequestClient from '@/client/graphqlRequestClient'
import Spinner from '@/components/Atoms/Spinner'
import {
  FindUserCellTransferRequestQuery,
  FindUserCellTransferRequestQueryVariables,
  useFindUserCellTransferRequestQuery,
  UserCellTransferStatus,
} from '@/graphql/generated'
import { stateUserInfo } from '@/stores/stateUserInfo'
import { getTodayString } from '@/utils/dateUtils'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import EmptyStateStarting from '@/components/Atoms/EmptyStates/EmptyStateStarting'
import CellTransferAcceptListItem from '@/components/Organisms/Cell/CellTransferAcceptListItem'

interface CellTransferAcceptProps {}

const CellTransferAccept = ({}: CellTransferAcceptProps) => {
  const now = dayjs()
  const userInfo = useRecoilValue(stateUserInfo)
  const [datafilter, setDatafilter] = useState({
    min: getTodayString(dayjs(now.set('month', -1))),
    max: getTodayString(now),
  })

  const { data, isLoading } = useFindUserCellTransferRequestQuery<
    FindUserCellTransferRequestQuery,
    FindUserCellTransferRequestQueryVariables
  >(
    graphlqlRequestClient,
    {
      id: Number(userInfo?.cell?.id),
      transferInStatus: [UserCellTransferStatus.Ordered],
      transferInDateFilter: {
        between: {
          min: datafilter.min,
          max: datafilter.max,
        },
      },
    },
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    }
  )

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center py-20 lg:py-32">
          <Spinner />
        </div>
      ) : data?.findCell.transfersIn.length !== 0 ? (
        <div className="grid grid-cols-1 gap-y-3 lg:grid-cols-2 lg:gap-x-6 xl:grid-cols-3 xl:gap-x-8">
          {data?.findCell.transfersIn.map((item) => (
            <CellTransferAcceptListItem key={item.id} member={item} />
          ))}
        </div>
      ) : (
        <EmptyStateStarting
          title="요청 사항이 없습니다"
          descrtiption="우리 셀로 배정신청 된 사항이 없습니다"
        />
      )}
    </div>
  )
}

export default CellTransferAccept
