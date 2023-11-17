import graphlqlRequestClient from '@/client/graphqlRequestClient'
import Spinner from '@/components/Atoms/Spinner'
import {
  AttendanceCheckStatus,
  FindUserCellTransferRequestQuery,
  FindUserCellTransferRequestQueryVariables,
  GetAttendanceCheckQuery,
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

interface CellTransferAcceptProps {
  isAttendanceLoading: boolean
  isAttendanceFetching: boolean
  attendanceStatus: GetAttendanceCheckQuery | undefined
}

const CellTransferAccept = ({
  isAttendanceLoading,
  isAttendanceFetching,
  attendanceStatus,
}: CellTransferAcceptProps) => {
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
      {isLoading || isAttendanceLoading || isAttendanceFetching ? (
        <div className="flex justify-center items-center py-20 lg:py-32">
          <Spinner />
        </div>
      ) : (
        <>
          {attendanceStatus &&
          attendanceStatus.attendanceCheck ===
            AttendanceCheckStatus.Completed ? (
            <div>
              {data?.findCell.transfersIn.length !== 0 ? (
                <div className="grid grid-cols-1 gap-y-3 lg:grid-cols-2 lg:gap-x-6 xl:grid-cols-3 xl:gap-x-8">
                  {data?.findCell.transfersIn.map((item) => (
                    <CellTransferAcceptListItem key={item.id} member={item} />
                  ))}
                </div>
              ) : (
                <div className="flex justify-center items-center py-20 lg:py-32">
                  <EmptyStateStarting
                    title="요청 사항이 없습니다"
                    descrtiption="우리 셀로 배정신청 된 사항이 없습니다"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="px-6 py-12 sm:px-6 sm:py-24 lg:px-16 lg:mx-auto">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  다른 리더들이
                  <br />
                  출석체크 중에 있습니다.
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
                  모든 리더들이 출석체크를 제출하면
                  <br />
                  새로운 셀원을 받을 수 있습니다
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default CellTransferAccept
