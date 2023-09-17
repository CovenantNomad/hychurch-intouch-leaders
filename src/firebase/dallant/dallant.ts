import toast from 'react-hot-toast'
import { db } from '@/client/firebaseConfig'
import { DALLANTS_COLLCTION } from '@/constants/constants'
import {
  DallantCellWithMemberType,
  DallantHistoryType,
  DallantMemberType,
} from '@/types/dallant'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'

export const getCellDallant = async (cellId: string | null) => {
  try {
    const DallantSettingRef = doc(
      db,
      DALLANTS_COLLCTION.DALLENTS,
      DALLANTS_COLLCTION.SETTINGS
    )
    const docSnap = await getDoc(DallantSettingRef)

    if (docSnap.exists()) {
      if (docSnap.data().isActivity) {
        const seasonName = docSnap.data().currentSeasonName

        let resultTemp: DallantCellWithMemberType = {
          cellId: '',
          cellName: '',
          community: '',
          totalAmount: 0,
          members: [],
        }

        if (cellId !== null) {
          const cellRef = doc(
            db,
            DALLANTS_COLLCTION.DALLENTS,
            seasonName,
            DALLANTS_COLLCTION.CELLS,
            cellId
          )
          const cellDoc = await getDoc(cellRef)

          if (cellDoc.exists()) {
            const membersRef = collection(
              db,
              DALLANTS_COLLCTION.DALLENTS,
              seasonName,
              DALLANTS_COLLCTION.CELLS,
              cellId,
              DALLANTS_COLLCTION.MEMBERS
            )
            const memberQuerySnapshot = await getDocs(membersRef)

            if (!memberQuerySnapshot.empty) {
              let membersTemp: DallantMemberType[] = []

              memberQuerySnapshot.forEach((member) => {
                membersTemp.push({
                  userId: member.data().userId,
                  userName: member.data().userName,
                  totalAmount: member.data().totalAmount,
                })
              })

              resultTemp = {
                cellId: cellId,
                cellName: cellDoc.data().cellName,
                community: cellDoc.data().community,
                totalAmount: cellDoc.data().totalAmount,
                members: membersTemp,
              }
            } else {
              resultTemp = {
                cellId: cellId,
                cellName: cellDoc.data().cellName,
                community: cellDoc.data().community,
                totalAmount: cellDoc.data().totalAmount,
                members: [],
              }
            }
          }
        }

        return resultTemp
      }
    }
  } catch (error: any) {
    console.log('@getCellDallant Error: ', error)
    toast.error(`에러가 발생하였습니다\n${error.message.split(':')[0]}`)
  }
}

export const getUserAccount = async (userId: string) => {
  try {
    const DallantSettingRef = doc(
      db,
      DALLANTS_COLLCTION.DALLENTS,
      DALLANTS_COLLCTION.SETTINGS
    )
    const docSnap = await getDoc(DallantSettingRef)

    if (docSnap.exists()) {
      if (docSnap.data().isActivity) {
        const seasonName = docSnap.data().currentSeasonName

        const accountRef = doc(
          db,
          DALLANTS_COLLCTION.DALLENTS,
          seasonName,
          DALLANTS_COLLCTION.ACCOUNTS,
          userId
        )
        const accountDoc = await getDoc(accountRef)

        if (accountDoc.exists()) {
          return {
            cellId: accountDoc.data().cellId,
            cellName: accountDoc.data().cellName,
            userId: accountDoc.data().userId,
            userName: accountDoc.data().userName,
            totalAmount: accountDoc.data().totalAmount,
          }
        } else {
          return null
        }
      }
    }
  } catch (error: any) {
    console.log('@getUserAccount Error: ', error)
    toast.error(`에러가 발생하였습니다\n${error.message.split(':')[0]}`)
  }
}

export const getUserDallantHistory = async (userId: string) => {
  try {
    const DallantSettingRef = doc(
      db,
      DALLANTS_COLLCTION.DALLENTS,
      DALLANTS_COLLCTION.SETTINGS
    )
    const docSnap = await getDoc(DallantSettingRef)

    if (docSnap.exists()) {
      if (docSnap.data().isActivity) {
        const seasonName = docSnap.data().currentSeasonName

        const historyRef = collection(
          db,
          DALLANTS_COLLCTION.DALLENTS,
          seasonName,
          DALLANTS_COLLCTION.ACCOUNTS,
          userId,
          DALLANTS_COLLCTION.HISTORY
        )
        const historyQuerySnapshot = await getDocs(historyRef)

        if (!historyQuerySnapshot.empty) {
          let historyTemp: DallantHistoryType[] = []

          historyQuerySnapshot.forEach((history) => {
            historyTemp.push(history.data() as DallantHistoryType)
          })

          return historyTemp
        } else {
          return null
        }
      }
    }
  } catch (error: any) {
    console.log('@getUserDallantHistory Error: ', error)
    toast.error(`에러가 발생하였습니다\n${error.message.split(':')[0]}`)
  }
}
