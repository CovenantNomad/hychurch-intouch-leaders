import { db } from '@/client/firebaseConfig'
import { CELLMEETING_COLLCTION } from '@/constants/constants'
import {
  TCellMeetingSubmissionDataForCell,
  TCellMeetingSubmissionDataForMember,
} from '@/types/cellMeeting'
import { doc, getDoc, runTransaction } from 'firebase/firestore'
import toast from 'react-hot-toast'
import { makeErrorMessage } from '@/utils/utils'

export const getCellMeetingSubmissionStatus = async (
  cellId: string,
  baseDateString: string
) => {
  try {
    const cellMeetingRef = doc(
      db,
      CELLMEETING_COLLCTION.CELLMEETINGS,
      CELLMEETING_COLLCTION.DATA,
      CELLMEETING_COLLCTION.CELLLIST,
      cellId,
      CELLMEETING_COLLCTION.CELLHISTORY,
      baseDateString
    )

    const cellMeetingDoc = await getDoc(cellMeetingRef)

    if (!cellMeetingDoc.exists()) {
      return {
        submissionStatus: false,
        submissionData: null,
      }
    } else {
      return {
        submissionStatus: true,
        submissionData:
          cellMeetingDoc.data() as TCellMeetingSubmissionDataForCell,
      }
    }
  } catch (error: unknown) {
    console.error(error)
    toast.error(`에러가 발생하였습니다\n${makeErrorMessage(error)}`)
  }
}

export const onSaveCellMeeting = async ({
  cellId,
  baseDateString,
  submitDataForCell,
  submitDataForMember,
  submitDataForAbsentMember,
}: {
  cellId: string
  baseDateString: string
  submitDataForCell: TCellMeetingSubmissionDataForCell
  submitDataForMember: TCellMeetingSubmissionDataForMember[]
  submitDataForAbsentMember: TCellMeetingSubmissionDataForMember[]
}) => {
  const members = [...submitDataForMember, ...submitDataForAbsentMember]
  if (!cellId || !baseDateString || members.length === 0) {
    throw new Error('셀과 출석 명단을 확인해주세요')
  }
  if (new Set(members.map((member) => member.userId)).size !== members.length) {
    throw new Error('출석 명단에 중복된 셀원이 있습니다')
  }
  const cellDocRef = doc(
    db,
    CELLMEETING_COLLCTION.CELLMEETINGS,
    CELLMEETING_COLLCTION.DATA,
    CELLMEETING_COLLCTION.CELLLIST,
    cellId,
    CELLMEETING_COLLCTION.CELLHISTORY,
    baseDateString
  )

  // All reads precede writes; failure leaves every document unchanged.
  await runTransaction(db, async (transaction) => {
    const cellDoc = await transaction.get(cellDocRef)
    if (cellDoc.exists()) {
      throw new Error('이미 제출된 셀모임 출석입니다. 새로고침 후 확인해주세요')
    }
    const memberRefs = members.map((member) =>
      doc(
        db,
        CELLMEETING_COLLCTION.CELLMEETINGS,
        CELLMEETING_COLLCTION.DATA,
        CELLMEETING_COLLCTION.MEMBERLIST,
        member.userId,
        CELLMEETING_COLLCTION.HISTORY,
        baseDateString
      )
    )
    const memberDocs = await Promise.all(
      memberRefs.map((ref) => transaction.get(ref))
    )
    memberRefs.forEach((ref, index) => {
      // Preserve the existing policy: do not overwrite prior individual records.
      if (!memberDocs[index].exists()) transaction.set(ref, members[index])
    })
    transaction.set(cellDocRef, submitDataForCell)
  })
}
