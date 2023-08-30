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
import SearchFilterModal from '@/components/Atoms/Modals/SearchFilterModal'

interface CellTransferHistoryProps {}

const CellTransferHistory = ({}: CellTransferHistoryProps) => {
  const now = dayjs()
  const userInfo = useRecoilValue(stateUserInfo)
  const [datefilter, setDatefilter] = useState({
    min: getTodayString(now.subtract(1, 'month')),
    max: getTodayString(now),
  })

  const [openSearchFilterModal, setOpenSearchFilterModal] = useState(false)

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
          min: datefilter.min,
          max: datefilter.max,
        },
      },
      transferOutDateFilter: {
        between: {
          min: datefilter.min,
          max: datefilter.max,
        },
      },
    },
    {
      enabled: Boolean(datefilter.min),
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
          <div className="flex justify-between border-b border-black pb-3 mb-4">
            <p>
              {datefilter.min.replace('-', '.')} ~{' '}
              {datefilter.max.replace('-', '.')}
            </p>
            <div>
              <button
                type="button"
                onClick={() => setOpenSearchFilterModal(true)}
                className="cursor-pointer"
              >
                조회기간 설정
              </button>
            </div>
          </div>
          <ListTitleText>받은 셀원</ListTitleText>
          <div className="py-6">
            {data?.findCell.transfersIn.length !== 0 ? (
              data?.findCell.transfersIn.map((item) => (
                <CellTransferHistoryListItem key={item.id} member={item} />
              ))
            ) : (
              <EmptyStateStarting
                title="조회 내용이 없습니다"
                descrtiption="우리 셀로 배정신청 된 셀원이 없습니다"
              />
            )}
          </div>
          <Spacer size="h-4" />
          <ListTitleText>보낸 셀원</ListTitleText>
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
                title="조회 내용이 없습니다"
                descrtiption="다른 셀에서 승인대기 중인 셀원이 없습니다"
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
                title="조회 내용이 없습니다"
                descrtiption="조회기간 내 다른 셀로 보낸 셀원이 없습니다"
              />
            )}
          </div>
          <Spacer size="h-16" />
        </div>
      )}
      <SearchFilterModal
        open={openSearchFilterModal}
        setOpen={setOpenSearchFilterModal}
        now={now}
        datefilter={datefilter}
        setDateFilter={setDatefilter}
      />
    </div>
  )
}

export default CellTransferHistory
