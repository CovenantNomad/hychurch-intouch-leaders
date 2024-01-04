import { db } from '@/client/firebaseConfig'
import { EVALUATIONFORM_COLLCTION } from '@/constants/constants'
import {
  CellEvaluationSubmissionType,
  EvaluationSettingType,
  EvaluationSubmissionStatus,
  IndividualEvaluationDataType,
  IndividualSubmissionCheckType,
} from '@/types/evalutation'
import {
  collection,
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import toast from 'react-hot-toast'

// 셀평가서 전체세팅 가져오기
export const getEvalutationSettings = async () => {
  try {
    const settingRef = doc(
      db,
      EVALUATIONFORM_COLLCTION.EVALUATIONFORM,
      EVALUATIONFORM_COLLCTION.SETTINGS
    )
    const settingDoc = await getDoc(settingRef)

    if (!settingDoc.exists()) {
      toast.error(`DB가 없습니다. 개발팀에 연락주세요.`)
      return null
    } else {
      return settingDoc.data() as EvaluationSettingType
    }
  } catch (error: any) {
    console.log('@getCellMeeting Error: ', error)
    toast.error(`에러가 발생하였습니다\n${error.message.split(':')[0]}`)
    return null
  }
}

// 개인별 저장 상태 가져오기
export const getIndividaulSubmissionStatus = async ({
  seasonName,
  userId,
}: {
  seasonName: string
  userId: string
}) => {
  try {
    const memberDocRef = doc(
      db,
      EVALUATIONFORM_COLLCTION.EVALUATIONFORM,
      seasonName,
      EVALUATIONFORM_COLLCTION.MEMBERLIST,
      userId
    )
    const memberDoc = await getDoc(memberDocRef)

    if (!memberDoc.exists()) {
      return IndividualSubmissionCheckType.NOT_SUBMITTED
    } else {
      return IndividualSubmissionCheckType.SAVED
    }
  } catch (error: any) {
    console.log('@getCellMeeting Error: ', error)
    toast.error(`에러! 셀원정보를 읽어오지 못했습니다`)
    return null
  }
}

// 셀 최종제출 상태 가져오기
export const getCellSubmissionStatus = async ({
  seasonName,
  cellId,
}: {
  seasonName: string
  cellId: string
}) => {
  try {
    const cellDocRef = doc(
      db,
      EVALUATIONFORM_COLLCTION.EVALUATIONFORM,
      seasonName,
      EVALUATIONFORM_COLLCTION.SUBMISSION,
      cellId
    )
    const cellDoc = await getDoc(cellDocRef)

    if (!cellDoc.exists()) {
      return {
        cellId,
        submissionStatus: EvaluationSubmissionStatus.NOTSUBMITTED,
      }
    } else {
      return cellDoc.data() as CellEvaluationSubmissionType
    }
  } catch (error: any) {
    console.log('@getCellMeeting Error: ', error)
    toast.error(`에러! 셀원정보를 읽어오지 못했습니다`)
    return null
  }
}

// 개인별 제출내용 가져오기
export const getIndividaulEvaluationSubmission = async ({
  seasonName,
  userId,
}: {
  seasonName: string
  userId: string
}) => {
  try {
    const memberDocRef = doc(
      db,
      EVALUATIONFORM_COLLCTION.EVALUATIONFORM,
      seasonName,
      EVALUATIONFORM_COLLCTION.MEMBERLIST,
      userId
    )
    const memberDoc = await getDoc(memberDocRef)

    if (!memberDoc.exists()) {
      return null
    } else {
      return memberDoc.data() as IndividualEvaluationDataType
    }
  } catch (error: any) {
    console.log('@getCellMeeting Error: ', error)
    toast.error(`에러! 셀원정보를 읽어오지 못했습니다`)
    return null
  }
}

// 개인별 셀원정보 제출하기
export const createIndividaulEvaluation = async (
  submitData: IndividualEvaluationDataType
) => {
  try {
    const settingRef = doc(
      db,
      EVALUATIONFORM_COLLCTION.EVALUATIONFORM,
      EVALUATIONFORM_COLLCTION.SETTINGS
    )
    await runTransaction(db, async (transaction) => {
      const settingDoc = await transaction.get(settingRef)

      if (!settingDoc.exists() || !settingDoc.data().isActive) {
        throw '세팅이 설정되지 않았습니다'
      } else {
        const settingData = settingDoc.data() as EvaluationSettingType

        const memberDocRef = doc(
          db,
          EVALUATIONFORM_COLLCTION.EVALUATIONFORM,
          settingData.seasonName,
          EVALUATIONFORM_COLLCTION.MEMBERLIST,
          submitData.userId
        )
        const cellDocRef = doc(
          db,
          EVALUATIONFORM_COLLCTION.EVALUATIONFORM,
          settingData.seasonName,
          EVALUATIONFORM_COLLCTION.SUBMISSION,
          submitData.previousCellId
        )
        const cellDoc = await transaction.get(cellDocRef)

        transaction.set(memberDocRef, submitData)

        if (!cellDoc.exists()) {
          transaction.set(cellDocRef, {
            cellId: submitData.previousCellId,
            cellName: submitData.previousCellName,
            submissionStatus: EvaluationSubmissionStatus.INPROGRESS,
          })
        }
      }
    })
  } catch (error: any) {
    console.log('@getCellMeeting Error: ', error)
    toast.error(`에러가 발생하였습니다\n${error.message.split(':')[0]}`)
    return null
  }
}

// 셀 최종제출 하기
export const createCellEvaluationFormFinalSubmission = async ({
  cellId,
}: {
  cellId: string
}) => {
  try {
    const settingRef = doc(
      db,
      EVALUATIONFORM_COLLCTION.EVALUATIONFORM,
      EVALUATIONFORM_COLLCTION.SETTINGS
    )
    await runTransaction(db, async (transaction) => {
      const settingDoc = await transaction.get(settingRef)

      if (!settingDoc.exists() || !settingDoc.data().isActive) {
        throw '세팅이 설정되지 않았습니다'
      } else {
        const settingData = settingDoc.data() as EvaluationSettingType

        const cellDocRef = doc(
          db,
          EVALUATIONFORM_COLLCTION.EVALUATIONFORM,
          settingData.seasonName,
          EVALUATIONFORM_COLLCTION.SUBMISSION,
          cellId
        )
        const cellDoc = await transaction.get(cellDocRef)

        if (cellDoc.exists()) {
          transaction.update(cellDocRef, {
            submissionStatus: EvaluationSubmissionStatus.COMPLETE,
            submissionDate: serverTimestamp(),
          })
        }
      }
    })
  } catch (error: any) {
    console.log('@getCellMeeting Error: ', error)
    toast.error(`에러가 발생하였습니다\n${error.message.split(':')[0]}`)
    return null
  }
}
