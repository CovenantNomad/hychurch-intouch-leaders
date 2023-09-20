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
import { UserDallantHeaderViewDataType } from '@/types/dallant'

const useUserDallant = (userId: string) => {
  const [isLoading, setIsLoading] = useState(true)
  const [userInfo, setUserInfo] =
    useState<UserDallantHeaderViewDataType | null>(null)

  const {
    isLoading: isUserLoading,
    isFetching: isUserFetching,
    data: userData,
  } = useFindUserQuery<FindUserQuery, FindUserQueryVariables>(
    graphlqlRequestClient,
    { id: userId },
    {
      staleTime: 15 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
    }
  )

  const {
    isLoading: isAccountLoading,
    isFetching: isAccountFetching,
    data: accountData,
  } = useQuery(['getUserAccount', userId], () => getUserAccount(userId), {
    enabled: !!userId,
    staleTime: 15 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  })

  useEffect(() => {
    if (
      !isUserLoading &&
      !isAccountLoading &&
      !isAccountFetching &&
      !isUserFetching
    ) {
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
  }, [
    isUserLoading,
    isUserFetching,
    userData,
    isAccountLoading,
    isAccountFetching,
    accountData,
  ])

  return {
    isLoading,
    userInfo,
  }
}

export default useUserDallant
