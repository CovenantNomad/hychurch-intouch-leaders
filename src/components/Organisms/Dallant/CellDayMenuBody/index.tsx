import React, { useState } from 'react'
import useShoppingCart from '@/hooks/useShoppingCart'
import Container from '@/components/Atoms/Container/Container'
import { MinusIcon } from '@heroicons/react/20/solid'
import { PlusIcon } from '@heroicons/react/24/outline'
import useOrderState from '@/hooks/useOrderState'
import { OrderStatus } from '@/types/cellday'

interface CellDayMenuBodyProps {
  menuId: string
  menuName: string
  menuDescription?: string
  menuPrice: string
  menuImageUrl: string
}

const CellDayMenuBody = ({
  menuId,
  menuName,
  menuDescription,
  menuPrice,
  menuImageUrl,
}: CellDayMenuBodyProps) => {
  const [amount, setAmount] = useState<number>(1)
  const { onAddToCart } = useShoppingCart()
  const {
    orderState: { orderStatus },
  } = useOrderState()

  return (
    <div>
      <div className="py-6 border-b border-b-gray-300">
        <Container>
          <h4 className="text-xl font-bold">{menuName}</h4>
          <p className="text-sm text-gray-500 mt-1">{menuDescription}</p>
        </Container>
      </div>
      <Container>
        <div className="py-8 space-y-8">
          <div className="flex justify-between">
            <span className="font-semibold">가격</span>
            <span className="font-semibold">{menuPrice} 달란트</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">수량</span>
            <div className="flex flex-col items-end">
              <div className="flex items-center space-x-6">
                <button
                  disabled={amount <= 0}
                  onClick={() => setAmount(amount - 1)}
                  className="p-2 rounded-full border border-gray-400 disabled:border-gray-200"
                >
                  <MinusIcon
                    className={`h-4 w-4 ${
                      amount <= 0 ? 'text-gray-200' : 'text-gray-400'
                    }`}
                  />
                </button>
                <span>{amount}</span>
                <button
                  disabled={amount >= 3}
                  onClick={() => setAmount(amount + 1)}
                  className="p-2 rounded-full border border-gray-400 disabled:border-gray-200"
                >
                  <PlusIcon
                    className={`h-4 w-4 ${
                      amount > 3 ? 'text-gray-200' : 'text-gray-400'
                    }`}
                  />
                </button>
              </div>
              <div className="mt-2">
                <span className="text-xs text-blue-500">
                  최대 3인분까지 주문가능
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
      {orderStatus === OrderStatus.NOT_SUBMITTED && (
        <div className="mt-12">
          <button
            disabled={amount <= 0 || amount >= 4}
            onClick={() =>
              onAddToCart({
                menu: {
                  menuId,
                  menuName,
                  menuDescription,
                  menuPrice,
                  menuImageUrl,
                },
                amount,
              })
            }
            className="w-full py-4 px-2 bg-blue-500 disabled:bg-gray-200"
          >
            <span className="text-sm text-white font-bold">
              장바구니에 담기
            </span>
          </button>
        </div>
      )}
    </div>
  )
}

export default CellDayMenuBody
