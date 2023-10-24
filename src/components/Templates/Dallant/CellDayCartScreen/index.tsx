import React from 'react'
//hooks
import useCellDallant from '@/hooks/useCellDallant'
import useShoppingCart from '@/hooks/useShoppingCart'
//components
import InformationAlerts from '@/components/Atoms/Alerts/InformationAlerts'
import CellDayOrderListItem from '@/components/Organisms/Dallant/CellDayOrderListItem/CellDayOrderListItem'
import CellDayTotalPayment from '@/components/Organisms/Dallant/CellDayTotalPayment/CellDayTotalPayment'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import { useMutation } from '@tanstack/react-query'
import { createOrder } from '@/firebase/dallant/cellday'
import { CartType } from '@/types/cellday'

interface CellDayCartScreenProps {
  setTabIdx: React.Dispatch<React.SetStateAction<number>>
}

const CellDayCartScreen = ({ setTabIdx }: CellDayCartScreenProps) => {
  const { cart, onResetCart } = useShoppingCart()
  const { isLoading, cellInfo } = useCellDallant()
  const mutation = useMutation<void, [string, CartType]>({
    mutationFn: () => createOrder(cellInfo!.cellId, cart),
  })

  const onSubmitOrder = async () => {
    await mutation.mutateAsync()
    onResetCart()
    setTabIdx(1)
  }

  return (
    <div>
      <InformationAlerts description="주문 후에는 수정할 수 없습니다!" />
      <div className="py-8">
        <div className="flex justify-between items-end px-4 pb-4 md:px-6 lg:px-8">
          <h4 className="text-xl font-bold ">장바구니</h4>
          {isLoading ? (
            <div className="animate-pulse w-28 h-1.5 bg-gray-300 rounded-md" />
          ) : (
            <div>
              {cellInfo ? (
                <p>
                  셀 달란트 : {cellInfo.totalAmount.toLocaleString('Kr-kr')}{' '}
                  달란트
                </p>
              ) : (
                <p>셀 달란트를 가져올 수 없습니다.</p>
              )}
            </div>
          )}
        </div>
        {Number(cart.cartItemCount) !== 0 && cellInfo ? (
          <>
            <div className="border-b-8">
              <div className="divide-y divide-gray-300 border-y border-y-gray-300">
                {cart.cartItems.map((item, index) => (
                  <CellDayOrderListItem
                    key={index}
                    menuId={item.orderedMenuItem.menuId}
                    menuName={item.orderedMenuItem.menuName}
                    itemQuantity={item.itemQuantity}
                    itemPrice={item.itemPrice}
                  />
                ))}
              </div>
              <div className="flex justify-end py-5 px-4 md:px-6 lg:px-8">
                <button
                  onClick={() => setTabIdx(0)}
                  className="flex items-center justify-center px-3 py-1 border border-blue-500 rounded-3xl"
                >
                  <span className="text-sm text-blue-500">+ 메뉴 추가</span>
                </button>
              </div>
            </div>
            <CellDayTotalPayment
              totalOrderPrice={Number(cart.totalPrice)}
              totalCellDallant={Number(cellInfo.totalAmount)}
            />
            <div className="mt-12">
              <button
                disabled={
                  Number(cellInfo.totalAmount) - Number(cart.totalPrice) < 0
                }
                onClick={onSubmitOrder}
                className="w-full py-4 px-2 bg-blue-500 disabled:bg-gray-200"
              >
                <span className="text-sm text-white font-bold">주문하기</span>
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col justify-center items-center py-20">
            <ShoppingCartIcon className="h-12 w-12 text-gray-500" />
            <p className="text-sm text-gray-400 mt-4">
              장바구니가 비어있습니다.
            </p>
            <div className="mt-2">
              <button
                onClick={() => setTabIdx(0)}
                className="flex items-center border border-gray-900 rounded-sm py-2 px-2"
              >
                <span className="text-xs tracking-tight text-gray-900">
                  인터치잇츠 맛집 구경가기
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CellDayCartScreen
