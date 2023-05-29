import { atom } from 'recoil'
import { AttendanceGlobalState, AttendanceStatus } from '@/types/attendance'
import { getTodayString } from '@/utils/dateUtils'
import dayjs from 'dayjs'

export const attendanceState = atom<AttendanceGlobalState>({
  key: 'MAIN/ATTENDANCE',
  default: {
    status: AttendanceStatus.NOT_SUBMITTED,
    submitDate:
      dayjs().get('day') === 0
        ? getTodayString(dayjs())
        : getTodayString(dayjs().subtract(dayjs().get('day'), 'day')),
    tempAttendanceList: null,
    attendanceList: null,
  },
})
