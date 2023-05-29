import graphlqlRequestClient from '@/client/graphqlRequestClient'
import {
  CellLeaderAttendanceSubmissionStatus,
  SubmitAttendanceMutation,
  SubmitAttendanceMutationVariables,
  useSubmitAttendanceMutation,
} from '@/graphql/generated'
import { attendanceState } from '@/stores/attendaceState'
import { AttendanceStatus } from '@/types/attendance'
import { useQueryClient } from '@tanstack/react-query'
import { useRecoilState } from 'recoil'

interface onCheckHandlerPrps {
  checked: boolean
  churchServiceId: string
  userId: string
  userName: string
  isOnline: boolean
}

interface onToggleHandlerPrps {
  churchServiceId: string
  userId: string
}

const useAttendance = () => {
  const queryClient = useQueryClient()
  const [attendance, setAttendance] = useRecoilState(attendanceState)

  const onCheckHandler = ({
    checked,
    churchServiceId,
    userId,
    userName,
  }: onCheckHandlerPrps) => {
    if (checked) {
      if (attendance.tempAttendanceList === null) {
        setAttendance({
          ...attendance,
          status: AttendanceStatus.TEMPORARY_SAVE,
          submitDate: attendance.submitDate,
          tempAttendanceList: [
            {
              userId,
              userName,
              churchServiceId,
              isOnline: false,
              attendedAt: attendance.submitDate,
            },
          ],
        })
      } else {
        setAttendance({
          ...attendance,
          tempAttendanceList: [
            ...attendance.tempAttendanceList,
            {
              userId,
              userName,
              churchServiceId,
              isOnline: false,
              attendedAt: attendance.submitDate,
            },
          ],
        })
      }
    } else {
      if (attendance.tempAttendanceList !== null) {
        const filteredList = attendance.tempAttendanceList.filter(
          (item) =>
            !(
              item.userId === userId && item.churchServiceId === churchServiceId
            )
        )
        setAttendance({
          ...attendance,
          tempAttendanceList: filteredList,
        })
      }
    }
  }

  const onToggleHander = ({ userId, churchServiceId }: onToggleHandlerPrps) => {
    if (attendance.tempAttendanceList !== null) {
      const toggleList = attendance.tempAttendanceList.map((item) =>
        item.userId === userId && item.churchServiceId === churchServiceId
          ? { ...item, isOnline: !item.isOnline }
          : item
      )
      setAttendance({
        ...attendance,
        tempAttendanceList: toggleList,
      })
    }
  }

  const { mutateAsync } = useSubmitAttendanceMutation<
    SubmitAttendanceMutation,
    SubmitAttendanceMutationVariables
  >(graphlqlRequestClient, {
    onSettled(data, error, variables, context) {
      queryClient.invalidateQueries({
        queryKey: ['findmyCellAttendance'],
      })
    },
  })

  const onRemoveHandler = (userId: string, churchServiceId: string) => {
    if (attendance.tempAttendanceList !== null) {
      const filteredList = attendance.tempAttendanceList.filter(
        (item) =>
          !(item.userId === userId && item.churchServiceId === churchServiceId)
      )
      setAttendance({
        ...attendance,
        tempAttendanceList: filteredList,
      })
    }
  }

  const onTemporarySaveHandler = async () => {
    if (attendance.tempAttendanceList !== null) {
      try {
        const submitList = attendance.tempAttendanceList.map((item) => {
          return {
            userId: item.userId,
            churchServiceId: item.churchServiceId,
            isOnline: item.isOnline,
            description: item.description,
          }
        })
        const response = await mutateAsync({
          input: {
            userChurchServiceHistories: submitList,
            attendanceDate: attendance.submitDate,
            submissionStatus:
              CellLeaderAttendanceSubmissionStatus.TemporarySave,
          },
        })
        return {
          result: response,
        }
      } catch (error) {
        console.log(error)
        throw new Error('임시저장을 할 수 없습니다.')
      }
    } else {
      throw new Error('출석체크 인원이 없습니다')
    }
  }

  const onSubmitHandler = async () => {
    if (attendance.tempAttendanceList !== null) {
      try {
        const submitList = attendance.tempAttendanceList.map((item) => {
          return {
            userId: item.userId,
            churchServiceId: item.churchServiceId,
            isOnline: item.isOnline,
            description: item.description,
          }
        })
        const response = await mutateAsync({
          input: {
            userChurchServiceHistories: submitList,
            attendanceDate: attendance.submitDate,
            submissionStatus: CellLeaderAttendanceSubmissionStatus.Complete,
          },
        })
        return {
          result: response,
        }
      } catch (error) {
        console.log(error)
        throw new Error('출석체크를 저장 할 수 없습니다.')
      }
    } else {
      throw new Error('출석체크 인원이 없습니다')
    }
  }

  return {
    attendance,
    setAttendance,
    onCheckHandler,
    onToggleHander,
    onRemoveHandler,
    onTemporarySaveHandler,
    onSubmitHandler,
  }
}

export default useAttendance
