import React, { useCallback, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { stateUserInfo } from '@/stores/stateUserInfo'
import graphlqlRequestClient from '@/client/graphqlRequestClient'
import {
  AttendanceCheckStatus,
  CreateUserCellTransferMutation,
  CreateUserCellTransferMutationVariables,
  FindUserCellTransferRegisterQuery,
  FindUserCellTransferRegisterQueryVariables,
  GetAttendanceCheckQuery,
  RoleType,
  useCreateUserCellTransferMutation,
  useFindUserCellTransferRegisterQuery,
  UserCellTransferStatus,
} from '@/graphql/generated'
import Spacer from '@/components/Atoms/Spacer'
import ComboBoxImage from '@/components/Blocks/Combobox/ComboBoxImage'
import Summary from '@/components/Blocks/Summary/Summary'
import Spinner from '@/components/Atoms/Spinner'
import { SelectType, SpecialCellIdType } from '@/types/common'
import { toast } from 'react-hot-toast'
import { useQueryClient } from '@tanstack/react-query'
import { makeErrorMessage } from '@/utils/utils'
import { getTodayString } from '@/utils/dateUtils'
import dayjs from 'dayjs'
import { FIND_CELLS_LIMIT } from '@/constants/constants'
import SimpleModal from '@/components/Atoms/Modals/SimpleModal'

type CellTransferRegisterProps = {
  isAttendanceLoading: boolean
  isAttendanceFetching: boolean
  attendanceStatus: GetAttendanceCheckQuery | undefined
}

const CellTransferRegister = ({
  isAttendanceLoading,
  isAttendanceFetching,
  attendanceStatus,
}: CellTransferRegisterProps) => {
  const now = dayjs()
  const queryClient = useQueryClient()
  const userInfo = useRecoilValue(stateUserInfo)
  const [modalOpen, setModalOpen] = useState(false)
  const [datafilter, setDatafilter] = useState({
    min: getTodayString(now.subtract(1, 'month')),
    max: getTodayString(now),
  })
  const [memberList, setMemberList] = useState<SelectType[]>([])
  const [cellList, setCellList] = useState<SelectType[]>([])
  const [selectedPerson, setSelectedPerson] = useState<SelectType>({
    id: '',
    name: '',
  })
  const [selectedCell, setSelectedCell] = useState<SelectType>({
    id: '',
    name: '',
  })

  const { data, isLoading } = useFindUserCellTransferRegisterQuery<
    FindUserCellTransferRegisterQuery,
    FindUserCellTransferRegisterQueryVariables
  >(
    graphlqlRequestClient,
    {
      id: Number(userInfo?.cell?.id),
      limit: FIND_CELLS_LIMIT,
      transferOutStatus: [
        UserCellTransferStatus.Ordered,
        UserCellTransferStatus.Confirmed,
      ],
      transferOutDateFilter: {
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

  const { mutate } = useCreateUserCellTransferMutation<
    CreateUserCellTransferMutation,
    CreateUserCellTransferMutationVariables
  >(graphlqlRequestClient, {
    onSuccess(data, variables, context) {
      toast.success('셀원이동 신청이 접수되었습니다.')
      queryClient.invalidateQueries({
        queryKey: [
          'findUserCellTransferRegister',
          {
            id: Number(userInfo?.cell?.id),
            limit: FIND_CELLS_LIMIT,
            transferOutStatus: [
              UserCellTransferStatus.Ordered,
              UserCellTransferStatus.Confirmed,
            ],
            transferOutDateFilter: {
              between: {
                min: datafilter.min,
                max: datafilter.max,
              },
            },
          },
        ],
      })
      queryClient.invalidateQueries({
        queryKey: ['findUserCellTransferResult'],
      })
      setSelectedPerson({
        id: '',
        name: '',
      })
      setSelectedCell({
        id: '',
        name: '',
      })
    },
    onError(error) {
      if (error instanceof Error) {
        toast.error(
          `셀원이동 신청에 실패했습니다.\n${makeErrorMessage(error.message)}`
        )
      }
    },
  })

  useEffect(() => {
    if (data) {
      const memberList = data.findCell.members
        .filter(
          (member) =>
            !member.roles.includes(RoleType.CellLeader) &&
            !data.findCell.transfersOut
              .map(
                (transferedUser) =>
                  transferedUser.status === UserCellTransferStatus.Ordered &&
                  transferedUser.user.id
              )
              .includes(member.id)
        )
        .map((member) => {
          return {
            id: member.id,
            name: member.name,
          }
        })
      setMemberList(memberList)
      const cellList = data.findCells.nodes
        .filter(
          (cell) =>
            cell.id !== userInfo?.cell?.id &&
            !cell.id.includes(SpecialCellIdType.NewFamily) &&
            !cell.id.includes(SpecialCellIdType.Blessing)
        )
        .map((cell) => {
          return {
            id: cell.id,
            name: cell.name,
          }
        })
      setCellList(cellList)
    }
  }, [data, userInfo])

  const onTransferHandler = useCallback(() => {
    if (selectedPerson.id !== '' && selectedCell.id !== '' && userInfo?.cell) {
      const submitData = {
        userId: selectedPerson.id,
        fromCellId: userInfo?.cell?.id,
        toCellId: selectedCell.id,
        orderDate: getTodayString(dayjs()),
      }

      mutate({
        input: submitData,
      })
      setModalOpen(false)
    }
  }, [selectedCell, selectedPerson, userInfo, mutate])

  return (
    <div className="relative">
      {isLoading || isAttendanceLoading || isAttendanceFetching ? (
        <div className="flex justify-center items-center py-20 lg:py-32">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-0">
          {attendanceStatus &&
          attendanceStatus.attendanceCheck ===
            AttendanceCheckStatus.Completed ? (
            <>
              <div className="flex flex-col gap-y-6 lg:gap-y-8">
                <ComboBoxImage
                  label="셀원선택"
                  selected={selectedPerson}
                  setSelected={setSelectedPerson}
                  selectList={memberList}
                />
                <ComboBoxImage
                  label="셀선택"
                  selected={selectedCell}
                  setSelected={setSelectedCell}
                  selectList={cellList}
                />
              </div>
              <div>
                <Summary
                  header="Transfer Summary"
                  label="Transfer"
                  onClick={() => setModalOpen(true)}
                >
                  <Summary.Row
                    title="이동 할 셀원"
                    definition={selectedPerson.name}
                  />
                  <Summary.Row
                    title="이동 할 셀"
                    definition={selectedCell.name}
                  />
                </Summary>
              </div>
            </>
          ) : (
            <div className="col-span-12 px-6 py-12 sm:px-6 sm:py-24 lg:px-16 lg:mx-auto">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  다른 리더들이
                  <br />
                  출석체크 중에 있습니다.
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
                  모든 리더들이 출석체크를 제출하면
                  <br />
                  셀원에 대한 이동을 신청할 수 있습니다
                </p>
              </div>
            </div>
          )}
        </div>
      )}
      <SimpleModal
        title={'셀원이동'}
        description={`${selectedCell.name}로 '${selectedPerson.name}' 셀원을 이동하시겠습니까?`}
        actionLabel={'이동'}
        open={modalOpen}
        setOpen={setModalOpen}
        actionHandler={onTransferHandler}
      />
    </div>
  )
}

export default CellTransferRegister
