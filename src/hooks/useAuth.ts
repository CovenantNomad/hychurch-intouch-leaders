import graphlqlRequestClient from '@/client/graphqlRequestClient'
import { INTOUCH_LEADERS_ACCESS_TOKEN } from '@/constants/constants'
import { attendanceState } from '@/stores/attendaceState'
import { cellMeetingState } from '@/stores/cellMeetingState'
import { stateUserInfo } from '@/stores/stateUserInfo'
import { AttendanceStatus } from '@/types/attendance'
import { getTodayString } from '@/utils/dateUtils'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { cellDayCartState } from '@/stores/cellDayCartState'
import { cellDayOrderState } from '@/stores/cellDayOrderState'
import { stateSetting } from '@/stores/stateSetting'
import { useRecoilState, useSetRecoilState, useResetRecoilState } from 'recoil'

export const useAuth = () => {
  const [userInfo, setUserInfo] = useRecoilState(stateUserInfo)
  const setAttendance = useSetRecoilState(attendanceState)
  const setCellMeeting = useSetRecoilState(cellMeetingState)
  const resetCart = useResetRecoilState(cellDayCartState)
  const resetOrder = useResetRecoilState(cellDayOrderState)
  const resetSetting = useResetRecoilState(stateSetting)
  const router = useRouter()
  const queryClient = useQueryClient()

  const clearSession = useCallback(() => {
    queryClient.clear()
    setCellMeeting({
      tempAttendanceList: null,
    })
    setAttendance({
      status: AttendanceStatus.NOT_SUBMITTED,
      submitDate:
        dayjs().get('day') === 0
          ? getTodayString(dayjs())
          : getTodayString(dayjs().subtract(dayjs().get('day'), 'day')),
      tempAttendanceList: null,
      attendanceList: null,
    })
    resetCart()
    resetOrder()
    resetSetting()
    try {
      localStorage.removeItem(INTOUCH_LEADERS_ACCESS_TOKEN)
    } catch {
      // In-memory state must still be cleared when browser storage is blocked.
      console.error('브라우저의 로그인 저장 정보를 삭제하지 못했습니다.')
    }
    graphlqlRequestClient.setHeader('authorization', '')
    setUserInfo(null)
  }, [
    queryClient,
    setCellMeeting,
    setAttendance,
    resetCart,
    resetOrder,
    resetSetting,
    setUserInfo,
  ])

  const onLogOutHandler = () => {
    clearSession()
    void router.replace('/').catch(() => {
      window.location.replace('/')
    })
  }

  return {
    userInfo,
    setUserInfo,
    onLogOutHandler,
    clearSession,
  }
}
