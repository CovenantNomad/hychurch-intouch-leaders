import { Dayjs } from 'dayjs'
import { FieldValue, Timestamp } from 'firebase/firestore'

export type TCellMeetingSubmissionStatusData = {
  submissionStatus: boolean
  submissionData: TCellMeetingSubmissionDataForCell[] | null
}

export type TSubmissionObject = {
  userId: string
  userName: string
}

export type TCellMeetingSubmissionDataForCell = {
  cellId: string
  cellName: string
  baseDate: Date
  baseDateString: string
  totalMemberList: TSubmissionObject[]
  attendanceList: TSubmissionObject[]
  absentList: TSubmissionObject[]
  submittedAt: Date
}

export type TCellMeetingSubmissionDataForMember = {
  userId: string
  userName: string
  cellId: string
  cellName: string
  baseDate: Date
  baseDateString: string
  hasAttended: boolean
}

export interface CellMeetingGlobalState {
  tempAttendanceList: TCellMeetingSubmissionDataForMember[] | null
}
