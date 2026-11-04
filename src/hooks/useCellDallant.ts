import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { useQuery } from '@tanstack/react-query'
import graphlqlRequestClient from '@/client/graphqlRequestClient'
import { getCellDallant } from '@/firebase/dallant/dallant'
import {
  FindMyCellMembersQuery,
  FindMyCellMembersQueryVariables,
  RoleType,
  useFindMyCellMembersQuery,
} from '@/graphql/generated'
import { stateUserInfo } from '@/stores/stateUserInfo'
import { DallantCellCombinedMember, DallantCellType } from '@/types/dallant'
import toast from 'react-hot-toast'

const useCellDallant = () => {
  const userInfo = useRecoilValue(stateUserInfo)
  const [isLoading, setIsLoading] = useState(true)
  const [cellInfo, setCellInfo] = useState<DallantCellType | null>(null)
  const [cellMember, setCellMember] = useState<
    DallantCellCombinedMember[] | null
  >(null)

  const {
    isLoading: isCellLoading,
    isFetching: isCellFetching,
    data: cellData,
  } = useFindMyCellMembersQuery<
    FindMyCellMembersQuery,
    FindMyCellMembersQueryVariables
  >(
    graphlqlRequestClient,
    {},
    {
      staleTime: 15 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
    }
  )

  const cellId =
    userInfo?.cell?.id ||
    cellData?.myCellMembers?.find((member) =>
      member.roles.includes(RoleType.CellLeader)
    )?.cell?.id ||
    ''

  const {
    isLoading: isDallantLoading,
    isFetching: isDallantFetching,
    data: dallantData,
  } = useQuery(['getCellDallant', cellId], () => getCellDallant(cellId), {
    enabled: Boolean(cellId !== ''),
    staleTime: 15 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  })

  useEffect(() => {
    if (
      !isCellLoading &&
      !isDallantLoading &&
      !isCellFetching &&
      !isDallantFetching
    ) {
      const loadCellDallant = async () => {
        try {
          if (
            cellData &&
            cellData.myCellMembers &&
            dallantData &&
            dallantData.cellId === cellId
          ) {
            const combinedMembers = cellData.myCellMembers.map((cellMember) => {
              const matchingMember = dallantData.members.find(
                (dallantMember) => cellMember.id === dallantMember.userId
              )
              if (matchingMember) {
                return {
                  ...cellMember,
                  totalAmount: matchingMember.totalAmount,
                }
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
            setCellInfo(null)
            setCellMember(null)
          }
        } catch (error) {
          console.error('@loadCellDallant Error: ', error)
          toast.error(`데이터를 불러오는 중에 에러가 발생하였습니다`)
          setCellInfo(null)
          setCellMember(null)
        }
      }

      loadCellDallant()
      setIsLoading(false)
    } else {
      setIsLoading(true)
    }
  }, [
    isCellLoading,
    cellData,
    isDallantLoading,
    dallantData,
    cellId,
    isCellFetching,
    isDallantFetching,
  ])

  return {
    isLoading,
    cellInfo: cellInfo?.cellId === cellId ? cellInfo : null,
    cellMember: cellInfo?.cellId === cellId ? cellMember : null,
  }
}

export default useCellDallant
