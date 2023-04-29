import { atom } from 'recoil'
import { AttendanceGlobalState, AttendanceStatus } from '@/types/attendance'

export const attendanceState = atom<AttendanceGlobalState>({
  key: 'MAIN/ATTENDANCE',
  default: {
    status: AttendanceStatus.BEFORE,
    submitDate: null,
    attendanceList: null,
  },
})
