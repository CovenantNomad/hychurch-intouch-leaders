export enum AttendanceStatus {
  NOT_SUBMITTED = 'NOT_SUBMITTED',
  TEMPORARY_SAVE = 'TEMPORARY_SAVE',
  COMPLETE = 'COMPLETE',
}

export interface TempSavedAttendanceHistory {
  userId: string
  userName: string
  churchServiceId: string
  attendedAt: string
  isOnline: boolean
  description?: string | null | undefined
}

export interface AttendanceHistory {
  id: string
  attendedAt: string
  user: {
    id: string
    name: string
  }
  churchService: {
    id: string
    name: string
  }
  isOnline: boolean
  description?: string | null | undefined
}

export interface AttendanceGlobalState {
  status: AttendanceStatus
  submitDate: string
  tempAttendanceList: TempSavedAttendanceHistory[] | null
  attendanceList: AttendanceHistory[] | null
}
