import graphlqlRequestClient from '@/client/graphqlRequestClient'
import {
  getCellMeetingSubmissionStatus,
  onSaveCellMeeting,
} from '@/firebase/cellMeeting/cellmeeting'
import {
  FindMyCellMembersQuery,
  FindMyCellMembersQueryVariables,
  useFindMyCellMembersQuery,
} from '@/graphql/generated'
import { cellMeetingState } from '@/stores/cellMeetingState'
import {
  TCellMeetingSubmissionDataForCell,
  TCellMeetingSubmissionDataForMember,
} from '@/types/cellMeeting'
import { makeErrorMessage } from '@/utils/utils'
import { getMostRecentSunday } from '@/utils/dateUtils'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useRecoilState } from 'recoil'

type useCellMeetingProps = {
  cellId: string
  cellName: string
}

const useCellMeeting = ({ cellId, cellName }: useCellMeetingProps) => {
  const queryClient = useQueryClient()
  const baseDate = getMostRecentSunday()
  const modifiedBaseDate = baseDate
    .set('hour', 12)
    .set('minute', 0)
    .set('second', 0)
  const baseDateString = baseDate.format('YYYY-MM-DD')
  const [cellMeetingAttendance, setCellMeetingAttendance] =
    useRecoilState(cellMeetingState)
  const [isCellMembersLoading, setIsCellMembersLoading] = useState(false)
  const [isCellMeetingSubmissionLoading, setIsCellMeetingSubmissionLoading] =
    useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const submittingRef = useRef(false)

  const {
    isLoading: isCellMemberLoading,
    isFetching: isCellMemberFetching,
    data: cellMember,
  } = useFindMyCellMembersQuery<
    FindMyCellMembersQuery,
    FindMyCellMembersQueryVariables
  >(
    graphlqlRequestClient,
    {},
    {
      staleTime: 10 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
    }
  )

  const {
    isLoading: isCellMeetingLoading,
    isFetching: isCellMeetingFetching,
    data: cellMeetingSubmission,
  } = useQuery(
    ['getCellMeetingSubmissionStatus', cellId, baseDateString],
    () => getCellMeetingSubmissionStatus(cellId, baseDateString),
    {
      enabled: Boolean(cellId !== ''),
      staleTime: 15 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
    }
  )

  const mutation = useMutation({
    mutationFn: onSaveCellMeeting,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['getCellMeetingSubmissionStatus', cellId, baseDateString],
      })
    },
  })

  useEffect(() => {
    if (isCellMemberLoading || isCellMemberFetching) {
      setIsCellMembersLoading(true)
    } else {
      setIsCellMembersLoading(false)
    }
  }, [isCellMemberLoading, isCellMemberFetching])

  useEffect(() => {
    if (isCellMeetingLoading || isCellMeetingFetching) {
      setIsCellMeetingSubmissionLoading(true)
    } else {
      setIsCellMeetingSubmissionLoading(false)
    }
  }, [isCellMeetingLoading, isCellMeetingFetching])

  const onCheckHandler = ({
    checked,
    userId,
    userName,
    cellId,
    cellName,
  }: {
    checked: boolean
    userId: string
    userName: string
    cellName: string
    cellId: string
  }) => {
    if (checked) {
      if (cellMeetingAttendance.tempAttendanceList === null) {
        setCellMeetingAttendance({
          ...cellMeetingAttendance,
          tempAttendanceList: [
            {
              userId,
              userName,
              cellId,
              cellName,
              baseDate: modifiedBaseDate.toDate(),
              baseDateString,
              hasAttended: true,
            },
          ],
        })
      } else {
        setCellMeetingAttendance({
          ...cellMeetingAttendance,
          tempAttendanceList: [
            ...cellMeetingAttendance.tempAttendanceList,
            {
              userId,
              userName,
              cellId,
              cellName,
              baseDate: modifiedBaseDate.toDate(),
              baseDateString,
              hasAttended: true,
            },
          ],
        })
      }
    } else {
      if (cellMeetingAttendance.tempAttendanceList !== null) {
        const filteredList = cellMeetingAttendance.tempAttendanceList.filter(
          (item) => !(item.userId === userId)
        )
        setCellMeetingAttendance({
          ...cellMeetingAttendance,
          tempAttendanceList: filteredList,
        })
      }
    }
  }

  const onSaveHandler = async () => {
    if (submittingRef.current) return
    if (!cellId || !cellName || !cellMember?.myCellMembers?.length) {
      toast.error('셀과 셀원 정보를 불러온 뒤 다시 제출해주세요')
      return
    }
    const currentMembers = cellMember.myCellMembers
    const selected = cellMeetingAttendance.tempAttendanceList
    if (!selected?.length) {
      toast.error('출석체크 인원이 없습니다')
      return
    }
    if (
      selected.some(
        (member) =>
          member.cellId !== cellId ||
          member.baseDateString !== baseDateString ||
          !currentMembers.some((current) => current.id === member.userId)
      )
    ) {
      toast.error('출석 명단이 현재 셀 또는 날짜와 다릅니다. 다시 체크해주세요')
      return
    }
    submittingRef.current = true
    try {
      setIsSubmitting(true)
      if (
        cellMeetingAttendance.tempAttendanceList !== null &&
        cellMeetingAttendance.tempAttendanceList.length !== 0
      ) {
        // 셀데이터 만들기
        if (cellMember && cellMember.myCellMembers) {
          const totalMemberList = cellMember.myCellMembers.map((member) => {
            return { userId: member.id, userName: member.name }
          })
          const attendanceList = cellMeetingAttendance.tempAttendanceList.map(
            (member) => {
              return { userId: member.userId, userName: member.userName }
            }
          )
          const absentList = totalMemberList.filter(
            (member) =>
              !attendanceList.some(
                (presentMember) => presentMember.userId === member.userId
              )
          )

          const submitDataForCell: TCellMeetingSubmissionDataForCell = {
            cellId,
            cellName,
            baseDate: modifiedBaseDate.toDate(),
            baseDateString,
            totalMemberList,
            attendanceList,
            absentList,
            submittedAt: new Date(),
          }

          const submitDataForAbsentMember: TCellMeetingSubmissionDataForMember[] =
            absentList.map((member) => {
              return {
                userId: member.userId,
                userName: member.userName,
                cellId,
                cellName,
                baseDate: modifiedBaseDate.toDate(),
                baseDateString,
                hasAttended: false,
              }
            })

          await mutation.mutateAsync({
            cellId,
            baseDateString,
            submitDataForCell,
            submitDataForMember: cellMeetingAttendance.tempAttendanceList,
            submitDataForAbsentMember,
          })
        }
      }

      toast.success('셀모임 출석체크 제출 완료하였습니다')
    } catch (error) {
      console.error('@cellMeeting-onSaveHandler: ', error)
      toast.error(makeErrorMessage(error))
    } finally {
      submittingRef.current = false
      setIsSubmitting(false)
    }
  }

  return {
    isCellMembersLoading,
    isCellMeetingSubmissionLoading,
    isSubmitting,
    cellMeetingSubmission,
    cellMember,
    cellMeetingAttendance,
    onCheckHandler,
    onSaveHandler,
    setIsSubmitting,
  }
}

export default useCellMeeting
