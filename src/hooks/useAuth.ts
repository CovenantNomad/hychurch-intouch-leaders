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
import { useRecoilState, useSetRecoilState } from 'recoil'

export const useAuth = () => {
  const [userInfo, setUserInfo] = useRecoilState(stateUserInfo)
  const setAttendance = useSetRecoilState(attendanceState)
  const setCellMeeting = useSetRecoilState(cellMeetingState)
  const router = useRouter()
  const queryClient = useQueryClient()

  const onLogOutHandler = () => {
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
    localStorage.removeItem(INTOUCH_LEADERS_ACCESS_TOKEN)
    graphlqlRequestClient.setHeader('authorization', '')
    setUserInfo(null)
    router.push('/')
  }

  return {
    userInfo,
    setUserInfo,
    onLogOutHandler,
  }
}
