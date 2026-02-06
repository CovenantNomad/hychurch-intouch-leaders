import graphlqlRequestClient from '@/client/graphqlRequestClient'
import SimpleModal from '@/components/Atoms/Modals/SimpleModal'
import Spinner from '@/components/Atoms/Spinner'
import { FIND_CELLS_LIMIT } from '@/constants/constants'
import {
  AttendanceCheckStatus,
  CreateUserCellTransferMutation,
  CreateUserCellTransferMutationVariables,
  FindUserCellTransferRegisterQuery,
  FindUserCellTransferRegisterQueryVariables,
  GetAttendanceCheckQuery,
  RoleType,
  UpdateUserMutation,
  UpdateUserMutationVariables,
  useCreateUserCellTransferMutation,
  useFindUserCellTransferRegisterQuery,
  UserCellTransferStatus,
  useUpdateUserMutation,
} from '@/graphql/generated'
import { stateUserInfo } from '@/stores/stateUserInfo'
import { SelectType, SpecialCellIdType } from '@/types/common'
import { getTodayString } from '@/utils/dateUtils'
import { makeErrorMessage } from '@/utils/utils'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useRecoilValue } from 'recoil'
import {
  convertUserGrade,
  EMPTY_SELECT,
  TAB,
} from './CellTransferRegister/CellTransfer.constants'
import CellTransferForm from './CellTransferRegister/CellTransferForm'

type Props = {
  isAttendanceLoading: boolean
  isAttendanceFetching: boolean
  attendanceStatus: GetAttendanceCheckQuery | undefined
}

const CellTransferRegister = ({
  isAttendanceLoading,
  isAttendanceFetching,
  attendanceStatus,
}: Props) => {
  const now = dayjs()
  const queryClient = useQueryClient()
  const userInfo = useRecoilValue(stateUserInfo)
  const [modalOpen, setModalOpen] = useState(false)
  const [tabIdx, setTabIdx] = useState<number>(TAB.OTHER_CELL)

  const [datafilter, setDatafilter] = useState({
    min: getTodayString(now.subtract(1, 'month')),
    max: getTodayString(now),
  })

  const [memberList, setMemberList] = useState<SelectType[]>([])
  const [cellList, setCellList] = useState<SelectType[]>([])

  const [selectedPerson, setSelectedPerson] = useState<SelectType>(EMPTY_SELECT)
  const [selectedCell, setSelectedCell] = useState<SelectType>(EMPTY_SELECT)
  const [selectedGrade, setSelectedGrade] = useState<SelectType>(EMPTY_SELECT)

  const resetSelections = useCallback(
    (
      targets: Array<'person' | 'cell' | 'grade'> = ['person', 'cell', 'grade']
    ) => {
      if (targets.includes('person')) setSelectedPerson(EMPTY_SELECT)
      if (targets.includes('cell')) setSelectedCell(EMPTY_SELECT)
      if (targets.includes('grade')) setSelectedGrade(EMPTY_SELECT)
    },
    []
  )

  const onChangeTab = useCallback(
    (nextTab: number) => {
      setTabIdx(nextTab)

      if (nextTab === TAB.OTHER_CELL) {
        resetSelections()
        return
      }

      // 새싹셀 탭: 셀은 고정
      resetSelections()
      setSelectedCell({ id: SpecialCellIdType.Renew, name: '새싹셀' })
    },
    [resetSelections]
  )

  const { data, isLoading } = useFindUserCellTransferRegisterQuery<
    FindUserCellTransferRegisterQuery,
    FindUserCellTransferRegisterQueryVariables
  >(graphlqlRequestClient, {
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
  })

  useEffect(() => {
    if (!data) return

    const members = data.findCell.members
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

    const cells = data.findCells.nodes
      .filter(
        (cell) =>
          cell.id !== userInfo?.cell?.id &&
          !cell.id.includes(SpecialCellIdType.NewFamily) &&
          !cell.id.includes(SpecialCellIdType.Blessing) &&
          !cell.id.includes(SpecialCellIdType.Renew)
      )
      .map((c) => ({ id: c.id, name: c.name }))

    setMemberList(members)
    setCellList(cells)
  }, [data, userInfo])

  const invalidateAfterTransfer = useCallback(() => {
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
            between: { min: datafilter.min, max: datafilter.max },
          },
        },
      ],
    })
    queryClient.invalidateQueries({ queryKey: ['findUserCellTransferResult'] })
  }, [queryClient, userInfo, datafilter])

  const { mutateAsync: createTransferAsync } =
    useCreateUserCellTransferMutation<
      CreateUserCellTransferMutation,
      CreateUserCellTransferMutationVariables
    >(graphlqlRequestClient)

  const { mutateAsync: updateUserAsync } = useUpdateUserMutation<
    UpdateUserMutation,
    UpdateUserMutationVariables
  >(graphlqlRequestClient)

  /* 탭별 disabled */
  const submitDisabled = useMemo(() => {
    if (tabIdx === TAB.OTHER_CELL) {
      return selectedPerson.id === '' || selectedCell.id === ''
    }
    return selectedPerson.id === '' || selectedGrade.id === ''
  }, [tabIdx, selectedPerson.id, selectedCell.id, selectedGrade.id])

  /* (공통) 모달 열기 전, 부족한 값 안내 */
  const openConfirmModal = useCallback(() => {
    if (!userInfo?.cell?.id) {
      toast.error('현재 셀 정보가 없습니다.')
      return
    }

    if (submitDisabled) {
      if (selectedPerson.id === '') toast.error('셀원을 선택해주세요')

      if (tabIdx === TAB.OTHER_CELL && selectedCell.id === '') {
        toast.error('셀을 선택해주세요')
      }

      if (tabIdx === TAB.RENEW_CELL && selectedGrade.id === '') {
        toast.error('이동 사유를 선택해주세요')
      }

      return
    }

    setModalOpen(true)
  }, [
    userInfo,
    submitDisabled,
    selectedPerson.id,
    selectedCell.id,
    selectedGrade.id,
    tabIdx,
  ])

  /* 다른셀로 이동 */
  const submitOtherCellTransfer = useCallback(async () => {
    if (!userInfo?.cell?.id) throw new Error('NO_CELL')
    await createTransferAsync({
      input: {
        userId: selectedPerson.id,
        fromCellId: userInfo.cell.id,
        toCellId: selectedCell.id,
        orderDate: getTodayString(dayjs()),
      },
    })

    toast.success('셀원 이동 신청이 접수되었습니다.')
    invalidateAfterTransfer()
    resetSelections()
  }, [
    userInfo,
    createTransferAsync,
    selectedPerson.id,
    selectedCell.id,
    invalidateAfterTransfer,
    resetSelections,
  ])

  /* 다른셀로 이동 */
  const submitSproutCellTransfer = useCallback(async () => {
    if (!userInfo?.cell?.id) throw new Error('NO_CELL')

    const member = data?.findCell.members.find(
      (m) => m.id === selectedPerson.id
    )
    if (!member) throw new Error('NO_MEMBER')

    // 1) 새싹셀로 이동(신청) 먼저
    await createTransferAsync({
      input: {
        userId: selectedPerson.id,
        fromCellId: userInfo.cell.id,
        toCellId: SpecialCellIdType.Renew, // 새싹셀
        orderDate: getTodayString(dayjs()),
      },
    })

    const userGrade = convertUserGrade(selectedGrade.id)

    // 2) 이동 성공하면 grade 업데이트
    await updateUserAsync({
      input: {
        id: member.id,
        name: member.name,
        grade: userGrade,
        gender: member.gender!,
        birthday: member.birthday!,
        phone: member.phone,
        isActive: member.isActive,
      },
    })

    toast.success('새싹셀 이동 신청이 접수되었습니다.')

    // invalidate (이동 리스트/결과 + 멤버 리스트)
    invalidateAfterTransfer()
    queryClient.invalidateQueries({
      queryKey: ['findMyCellMember', { id: userInfo.cell.id }],
    })

    resetSelections()
    // 새싹셀 탭은 셀 고정 유지하고 싶으면 아래처럼 다시 세팅
    setSelectedCell({ id: SpecialCellIdType.Renew, name: '새싹셀' })
  }, [
    userInfo,
    data,
    selectedPerson.id,
    selectedGrade.id,
    createTransferAsync,
    updateUserAsync,
    invalidateAfterTransfer,
    queryClient,
    resetSelections,
  ])

  const onConfirmSubmit = useCallback(async () => {
    try {
      if (tabIdx === TAB.OTHER_CELL) {
        await submitOtherCellTransfer()
      } else {
        await submitSproutCellTransfer()
      }
      setModalOpen(false)
    } catch (error) {
      setModalOpen(false)

      if (error instanceof Error) {
        const msg =
          error.message === 'NO_CELL'
            ? '현재 셀 정보가 없습니다.'
            : error.message === 'NO_MEMBER'
            ? '셀원 정보를 찾을 수 없습니다.'
            : makeErrorMessage(error.message)

        toast.error(`처리에 실패했습니다.\n${msg}`)
        return
      }

      toast.error('처리에 실패했습니다.')
    }
  }, [tabIdx, submitOtherCellTransfer, submitSproutCellTransfer])

  const onCancel = useCallback(() => {
    if (tabIdx === TAB.OTHER_CELL) {
      resetSelections(['person', 'cell'])
      return
    }

    resetSelections(['person', 'grade'])
    setSelectedCell({ id: SpecialCellIdType.Renew, name: '새싹셀' })
  }, [tabIdx, resetSelections])

  const isAttendanceOk =
    attendanceStatus &&
    attendanceStatus.attendanceCheck === AttendanceCheckStatus.Completed

  if (isLoading || isAttendanceLoading || isAttendanceFetching) {
    return (
      <div className="flex justify-center items-center py-20 lg:py-32">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="relative">
      {isAttendanceOk ? (
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-0">
          <CellTransferForm
            tabIdx={tabIdx}
            onChangeTab={onChangeTab}
            memberList={memberList}
            cellList={cellList}
            selectedPerson={selectedPerson}
            setSelectedPerson={setSelectedPerson}
            selectedCell={selectedCell}
            setSelectedCell={setSelectedCell}
            selectedGrade={selectedGrade}
            setSelectedGrade={setSelectedGrade}
            summaryHeader="셀 이동 신청내용"
            submitDisabled={submitDisabled}
            onCancel={onCancel}
            onSubmit={openConfirmModal}
          />
        </div>
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

      <SimpleModal
        title="셀원 이동 신청 확인"
        description={
          tabIdx === TAB.OTHER_CELL
            ? `${selectedCell.name}로 '${selectedPerson.name}' 셀원을 이동하시겠습니까?`
            : `새싹셀로 '${selectedPerson.name}' 셀원을 이동하시겠습니까?`
        }
        actionLabel="이동"
        open={modalOpen}
        setOpen={setModalOpen}
        actionHandler={onConfirmSubmit}
      />
    </div>
  )
}

export default CellTransferRegister
