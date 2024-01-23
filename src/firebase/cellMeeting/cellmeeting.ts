import { db } from '@/client/firebaseConfig'
import { CELLMEETING_COLLCTION } from '@/constants/constants'
import {
  TCellMeetingSubmissionDataForCell,
  TCellMeetingSubmissionDataForMember,
} from '@/types/cellMeeting'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import toast from 'react-hot-toast'

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
  } catch (error: any) {
    console.error(error)
    toast.error(`에러가 발생하였습니다\n${error.message.split(':')[0]}`)
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
  try {
    for (const memberData of submitDataForMember) {
      const memberDocRef = doc(
        db,
        CELLMEETING_COLLCTION.CELLMEETINGS,
        CELLMEETING_COLLCTION.DATA,
        CELLMEETING_COLLCTION.MEMBERLIST,
        memberData.userId,
        CELLMEETING_COLLCTION.HISTORY,
        baseDateString
      )

      const memberDoc = await getDoc(memberDocRef)

      if (!memberDoc.exists()) {
        await setDoc(memberDocRef, memberData)
      }
    }

    for (const memberData of submitDataForAbsentMember) {
      const memberDocRef = doc(
        db,
        CELLMEETING_COLLCTION.CELLMEETINGS,
        CELLMEETING_COLLCTION.DATA,
        CELLMEETING_COLLCTION.MEMBERLIST,
        memberData.userId,
        CELLMEETING_COLLCTION.HISTORY,
        baseDateString
      )

      const memberDoc = await getDoc(memberDocRef)

      if (!memberDoc.exists()) {
        await setDoc(memberDocRef, memberData)
      }
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
    const cellDoc = await getDoc(cellDocRef)

    if (!cellDoc.exists()) {
      await setDoc(cellDocRef, submitDataForCell)
    }
  } catch (error: any) {
    console.error(error)
    toast.error(`에러가 발생하였습니다\n${error.message.split(':')[0]}`)
  }
}
