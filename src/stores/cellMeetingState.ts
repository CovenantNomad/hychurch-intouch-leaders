import { atom } from 'recoil'
import { CellMeetingGlobalState } from '@/types/cellMeeting'

export const cellMeetingState = atom<CellMeetingGlobalState>({
  key: 'MAIN/CELLMETTING',
  default: {
    tempAttendanceList: null,
  },
})
