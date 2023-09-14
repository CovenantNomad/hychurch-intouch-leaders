import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import graphlqlRequestClient from '@/client/graphqlRequestClient'
import { getUserAccount } from '@/firebase/dallant/dallant'
import {
  FindUserQuery,
  FindUserQueryVariables,
  RoleType,
  useFindUserQuery,
} from '@/graphql/generated'
import { DallantCellType, UserDallantHeaderViewDataType } from '@/types/dallant'

const useUserDallant = (userId: string) => {
  const [isLoading, setIsLoading] = useState(true)
  const [userInfo, setUserInfo] =
    useState<UserDallantHeaderViewDataType | null>(null)

  const { isLoading: isUserLoading, data: userData } = useFindUserQuery<
    FindUserQuery,
    FindUserQueryVariables
  >(
    graphlqlRequestClient,
    { id: userId },
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    }
  )

  const { isLoading: isAccountLoading, data: accountData } = useQuery(
    ['getUserAccount', userId],
    () => getUserAccount(userId),
    {
      enabled: !!userId,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    }
  )

  useEffect(() => {
    if (!isUserLoading && !isAccountLoading) {
      if (userData && userData.user && accountData) {
        setUserInfo({
          cellId: userData.user.cell?.id || '999',
          cellName: userData.user.cell?.name || '미편성',
          userId: userData.user.id,
          userName: userData.user.name,
          totalAmount: accountData.totalAmount,
          isLeader: userData.user.roles.includes(RoleType.CellLeader),
        })
      } else {
        if (userData && userData.user) {
          setUserInfo({
            cellId: userData.user.cell?.id || '999',
            cellName: userData.user.cell?.name || '미편성',
            userId: userData.user.id,
            userName: userData.user.name,
            totalAmount: 0,
            isLeader: userData.user.roles.includes(RoleType.CellLeader),
          })
        }
      }
      setIsLoading(false)
    } else {
      setIsLoading(true)
    }
  }, [isUserLoading, userData, isAccountLoading, accountData])

  return {
    isLoading,
    userInfo,
  }
}

export default useUserDallant
