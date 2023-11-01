import React from 'react'
import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/solid'
import Container from '@/components/Atoms/Container/Container'
import useShoppingCart from '@/hooks/useShoppingCart'

interface CellDayOrderListItemProps {
  menuId: string
  menuName: string
  itemQuantity: string
  itemPrice: string
}

const CellDayOrderListItem = ({
  menuId,
  menuName,
  itemQuantity,
  itemPrice,
}: CellDayOrderListItemProps) => {
  const { onRemoveFromCart, onUpdateCartItemQuantity } = useShoppingCart()

  return (
    <Container>
      <div className="flex justify-between py-8">
        <div className="space-y-4">
          <p>{menuName}</p>
          <p className="font-semibold">{itemPrice} 달란트</p>
        </div>
        <div className="flex flex-col justify-center">
          <div className="space-x-6 bg-blue-500 px-2.5 py-1 rounded-full">
            {Number(itemQuantity) <= 1 ? (
              <button onClick={() => onRemoveFromCart(menuId)}>
                <TrashIcon className={`h-4 w-4 text-white`} />
              </button>
            ) : (
              <button
                onClick={() =>
                  onUpdateCartItemQuantity(menuId, Number(itemQuantity) - 1)
                }
              >
                <MinusIcon className={`h-4 w-4 text-white`} />
              </button>
            )}
            <span className="text-white">{itemQuantity}</span>
            <button
              disabled={Number(itemQuantity) >= 3}
              onClick={() =>
                onUpdateCartItemQuantity(menuId, Number(itemQuantity) + 1)
              }
            >
              <PlusIcon
                className={`h-4 w-4 ${
                  Number(itemQuantity) >= 3 ? 'text-gray-300' : 'text-white'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default CellDayOrderListItem
