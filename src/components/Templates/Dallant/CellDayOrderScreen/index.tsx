import Container from '@/components/Atoms/Container/Container'
import EmptyStateSimple from '@/components/Atoms/EmptyStates/EmptyStateSimple'
import useOrderState from '@/hooks/useOrderState'
import { convertSecondToDate } from '@/utils/dateUtils'
import React from 'react'

interface CellDayOrderScreenProps {}

const CellDayOrderScreen = ({}: CellDayOrderScreenProps) => {
  const { isLoading, isFetching, orderState } = useOrderState()

  return (
    <Container>
      <div className="py-8">
        {isLoading || isFetching ? (
          <>
            <h4 className="text-xl font-bold">주문현황</h4>
            <div className="space-y-4 mt-8">
              <div className="animate-pulse flex justify-between items-center py-6 px-4 border border-gray-300 rounded-md">
                <div>
                  <div className="w-16 h-1.5 bg-gray-200 rounded-lg" />
                  <div className="w-28 h-1.5 bg-gray-200 rounded-lg mt-2" />
                </div>
                <div className="h-10 w-10 p-2 bg-gray-200 rounded-xl" />
              </div>
              <div className="animate-pulse flex justify-between items-center py-6 px-4 border border-gray-300 rounded-md">
                <div>
                  <div className="w-16 h-1.5 bg-gray-200 rounded-lg" />
                  <div className="w-28 h-1.5 bg-gray-200 rounded-lg mt-2" />
                </div>
                <div className="h-10 w-10 p-2 bg-gray-200 rounded-xl" />
              </div>
            </div>
          </>
        ) : (
          <>
            {orderState.orderDocument ? (
              <div>
                <div className="flex items-end space-x-3 pb-8">
                  <h4 className="text-xl font-bold">주문현황</h4>
                  <span className="text-sm">
                    (주문일시 :{' '}
                    {convertSecondToDate(orderState.orderTime!.seconds).format(
                      'YYYY.MM.DD HH:mm:ss'
                    )}
                    )
                  </span>
                </div>
                <div className="space-y-4">
                  {orderState.orderDocument.cartItems.map((item) => (
                    <div
                      key={item.orderedMenuItem.menuId}
                      className="flex justify-between items-center py-6 px-4 border border-gray-300 rounded-md"
                    >
                      <div>
                        <span className="block font-bold">
                          {item.orderedMenuItem.menuName}
                        </span>
                        <span className="block text-sm text-gray-500 mt-1">
                          {item.orderedMenuItem.menuDescription}
                        </span>
                      </div>
                      <span className="block p-2 bg-gray-200 rounded-xl">
                        {item.itemQuantity}개
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <EmptyStateSimple />
              </div>
            )}
          </>
        )}
      </div>
    </Container>
  )
}

export default CellDayOrderScreen
