import { getOrderStatement } from '@/firebase/dallant/cellday'
import { cellDayOrderState } from '@/stores/cellDayOrderState'
import { stateUserInfo } from '@/stores/stateUserInfo'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

const useOrderState = () => {
  const userInfo = useRecoilValue(stateUserInfo)
  const [orderState, setOrderState] = useRecoilState(cellDayOrderState)
  const { isLoading, isFetching, data } = useQuery(
    ['getOrderStatement', orderState.cellId],
    () => getOrderStatement(orderState.cellId),
    {
      enabled: Boolean(orderState.cellId !== ''),
      staleTime: 15 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
    }
  )

  useEffect(() => {
    if (userInfo && userInfo.cell) {
      setOrderState({
        ...orderState,
        cellId: userInfo.cell.id,
      })
    }
  }, [])

  useEffect(() => {
    if (data) {
      setOrderState({
        ...orderState,
        orderStatus: data.orderStatus,
        orderNumber: data.orderNumber,
        orderDocument: data.orderDocument,
        orderTime: data.orderTime,
      })
    }
  }, [data])

  return {
    isLoading,
    isFetching,
    orderState,
  }
}

export default useOrderState
