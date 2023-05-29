import graphlqlRequestClient from '@/client/graphqlRequestClient'
// import EmptyStateStarting from '@/components/Atoms/EmptyStates/EmptyStateStarting'
import Spinner from '@/components/Atoms/Spinner'
import {
  FindUserCellTransferResultQuery,
  FindUserCellTransferResultQueryVariables,
  useFindUserCellTransferResultQuery,
  UserCellTransferStatus,
} from '@/graphql/generated'
import { stateUserInfo } from '@/stores/stateUserInfo'
import { getTodayString } from '@/utils/dateUtils'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import ListTitleText from '@/components/Atoms/Typography/ListTitleText'
import CellTransferHistoryListItem from './CellTransferHistoryListItem'
import Spacer from '@/components/Atoms/Spacer'
import EmptyStateSimple from '@/components/Atoms/EmptyStates/EmptyStateSimple'
import EmptyStateStarting from '@/components/Atoms/EmptyStates/EmptyStateStarting'

interface CellTransferHistoryProps {}

const CellTransferHistory = ({}: CellTransferHistoryProps) => {
  const now = dayjs()
  const userInfo = useRecoilValue(stateUserInfo)
  const [datafilter, setDatafilter] = useState({
    min: getTodayString(dayjs(now.set('month', -1))),
    max: getTodayString(now),
  })

  const { data, isLoading } = useFindUserCellTransferResultQuery<
    FindUserCellTransferResultQuery,
    FindUserCellTransferResultQueryVariables
  >(
    graphlqlRequestClient,
    {
      id: Number(userInfo?.cell?.id),
      transferInStatus: [
        UserCellTransferStatus.Ordered,
        UserCellTransferStatus.Confirmed,
        UserCellTransferStatus.Canceled,
      ],
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
      ) : (
        <div>
          <ListTitleText>Transfer-In</ListTitleText>
          <div className="py-6">
            {data?.findCell.transfersIn.length !== 0 ? (
              data?.findCell.transfersIn.map((item) => (
                <CellTransferHistoryListItem key={item.id} member={item} />
              ))
            ) : (
              <EmptyStateStarting
                title="요청 사항이 없습니다"
                descrtiption="우리 셀로 배정신청 된 사항이 없습니다"
              />
            )}
          </div>
          <Spacer size="h-4" />
          <ListTitleText>Transfer-Out</ListTitleText>
          <p className="mt-6 text-slate-600 text-sm">승인대기 상태</p>
          <div className={`bg-gray-50 py-6`}>
            {data?.findCell.transfersOut.filter(
              (item) => item.status === UserCellTransferStatus.Ordered
            ).length !== 0 ? (
              data?.findCell.transfersOut
                .filter(
                  (item) => item.status === UserCellTransferStatus.Ordered
                )
                .map((item) => (
                  <CellTransferHistoryListItem key={item.id} member={item} />
                ))
            ) : (
              <EmptyStateStarting
                title="요청 사항이 없습니다"
                descrtiption="승인대기 중인 사항이 없습니다"
              />
            )}
          </div>
          <p className="mt-6 text-slate-600 text-sm">이동 완료/거절</p>
          <div className="py-6">
            {data?.findCell.transfersOut.filter(
              (item) => item.status !== UserCellTransferStatus.Ordered
            ).length !== 0 ? (
              data?.findCell.transfersOut
                .filter(
                  (item) => item.status !== UserCellTransferStatus.Ordered
                )
                .map((item) => (
                  <CellTransferHistoryListItem key={item.id} member={item} />
                ))
            ) : (
              <EmptyStateStarting
                title="요청 사항이 없습니다"
                descrtiption="우리 셀에서 이동신청 된 사항이 없습니다"
              />
            )}
          </div>
          <Spacer size="h-16" />
        </div>
      )}
    </div>
  )
}

export default CellTransferHistory
