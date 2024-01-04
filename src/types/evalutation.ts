import { Timestamp } from 'firebase/firestore'

export enum WORSHIP_TYPE {
  INTOUCH_OFFLINE = '인터치예배(성전)',
  INTOUCH_ONLINE = '인터치예배(온라인)',
  OTHERS_SERVICES = '1~4부예배',
  ABSENT = '예배참석률 낮음',
}

export enum MEETING_GRADE {
  FIRST = '1등급',
  SECOND = '2등급',
  THIRD = '3등급',
}

export enum EvaluationSubmissionStatus {
  NOTSUBMITTED = 'NOTSUBMITTED',
  INPROGRESS = 'INPROGRESS',
  COMPLETE = 'COMPLETE',
}

export enum IndividualSubmissionCheckType {
  NOT_SUBMITTED = 'NOT_SUBMITTED',
  SAVED = 'SAVED',
}

export type EvaluationSettingType = {
  isActive: boolean
  seasonName: string
  entryPeriod: {
    from?: Timestamp
    to?: Timestamp
  }
  viewingPeriod: {
    from?: Timestamp
    to?: Timestamp
  }
}

export type EvaluationFormInputType = {
  worship: string
  meeting: string
  description: string
}

export type IndividualEvaluationDataType = {
  userId: string
  userName: string
  previousCellId: string
  previousCellName: string
  worship: string
  meeting: string
  description: string
}

export type CellEvaluationSubmissionType = {
  cellId: string
  cellName?: string
  submissionDate?: Timestamp
  submissionStatus: EvaluationSubmissionStatus
}
