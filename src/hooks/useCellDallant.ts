import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { useQuery } from '@tanstack/react-query'
import graphlqlRequestClient from '@/client/graphqlRequestClient'
import { getCellDallant } from '@/firebase/dallant/dallant'
import {
  FindMyCellMembersQuery,
  FindMyCellMembersQueryVariables,
  useFindMyCellMembersQuery,
} from '@/graphql/generated'
import { stateUserInfo } from '@/stores/stateUserInfo'
import { DallantCellCombinedMember, DallantCellType } from '@/types/dallant'

const useCellDallant = () => {
  const userInfo = useRecoilValue(stateUserInfo)
  const [isLoading, setIsLoading] = useState(true)
  const [cellInfo, setCellInfo] = useState<DallantCellType | null>(null)
  const [cellMember, setCellMember] = useState<
    DallantCellCombinedMember[] | null
  >(null)

  const { isLoading: isCellLoading, data: cellData } =
    useFindMyCellMembersQuery<
      FindMyCellMembersQuery,
      FindMyCellMembersQueryVariables
    >(
      graphlqlRequestClient,
      {},
      {
        staleTime: 10 * 60 * 1000,
        cacheTime: 30 * 60 * 1000,
      }
    )

  const { isLoading: isDallantLoading, data: dallantData } = useQuery(
    ['getCellDallant', userInfo!.id],
    () => getCellDallant(userInfo!.id),
    {
      enabled: Boolean(userInfo?.id),
      staleTime: 10 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
    }
  )

  useEffect(() => {
    if (!isCellLoading && !isDallantLoading) {
      if (cellData && cellData.myCellMembers && dallantData) {
        const combinedMembers = cellData.myCellMembers.map((cellMember) => {
          const matchingMember = dallantData.members.find(
            (dallantMember) => cellMember.id === dallantMember.userId
          )
          if (matchingMember) {
            return { ...cellMember, totalAmount: matchingMember.totalAmount }
          } else {
            return { ...cellMember, totalAmount: 0 }
          }
        })

        setCellInfo({
          cellId: dallantData.cellId,
          cellName: dallantData.cellName,
          community: dallantData.community,
          totalAmount: dallantData.totalAmount,
        })
        setCellMember(combinedMembers)
      } else {
        setCellMember(null)
      }
      setIsLoading(false)
    } else {
      setIsLoading(true)
    }
  }, [isCellLoading, cellData, isDallantLoading, dallantData])

  return {
    isLoading,
    cellInfo,
    cellMember,
  }
}

export default useCellDallant
