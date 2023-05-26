export enum AttendanceStatus {
  BEFORE = 'before',
  TEMPORARY = 'temporary',
  COMPLETED = 'completed',
}

export interface Attendance {
  userId: string
  userName: string
  churchServiceId: string
  attendedAt: string
  isOnline: boolean
  description?: string
}

export interface AttendanceGlobalState {
  status: AttendanceStatus
  submitDate: string | null
  attendanceList: Attendance[] | null
}
