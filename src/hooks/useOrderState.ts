import { getOrderStatement } from '@/firebase/dallant/cellday'
import { cellDayOrderState } from '@/stores/cellDayOrderState'
import { stateUserInfo } from '@/stores/stateUserInfo'
import { OrderStatus } from '@/types/cellday'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

const useOrderState = () => {
  const userInfo = useRecoilValue(stateUserInfo)
  const cellId = userInfo?.cell?.id || ''
  const [orderState, setOrderState] = useRecoilState(cellDayOrderState)
  const { isLoading, isFetching, data } = useQuery(
    ['getOrderStatement', cellId],
    () => getOrderStatement(cellId),
    {
      enabled: Boolean(cellId),
      staleTime: 15 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
    }
  )

  useEffect(() => {
    setOrderState(
      data?.cellId === cellId && cellId
        ? data
        : { cellId, orderStatus: OrderStatus.NOT_SUBMITTED }
    )
  }, [cellId, data, setOrderState])

  return {
    isLoading,
    isFetching,
    orderState:
      orderState.cellId === cellId
        ? orderState
        : { cellId, orderStatus: OrderStatus.NOT_SUBMITTED },
  }
}

export default useOrderState
