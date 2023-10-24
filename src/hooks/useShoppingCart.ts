import { useRecoilState } from 'recoil'
import { cellDayCartState } from '@/stores/cellDayCartState'
import toast from 'react-hot-toast'
import debounce from 'lodash/debounce'
import { MenuType } from '@/types/cellday'
import { MAX_ORDER_NUMBER } from '@/constants/constants'

interface onAddToCartProps {
  menu: MenuType
  amount: number
}

const useShoppingCart = () => {
  const [cart, setCart] = useRecoilState(cellDayCartState)

  const onAddToCart = ({
    menu: { menuId, menuName, menuDescription, menuPrice, menuImageUrl },
    amount,
  }: onAddToCartProps) => {
    const existingItemIndex = cart.cartItems.findIndex(
      (item) => item.orderedMenuItem.menuId === menuId
    )

    if (existingItemIndex !== -1) {
      const existingItem = cart.cartItems[existingItemIndex]
      if (Number(existingItem.itemQuantity) >= MAX_ORDER_NUMBER) {
        toast.error(`같은 메뉴는 ${MAX_ORDER_NUMBER}까지만 주문할 수 있습니다`)

        return
      } else {
        const updateQuantity = Math.min(
          MAX_ORDER_NUMBER,
          Number(existingItem.itemQuantity) + amount
        )
        const updatePrice = Math.min(
          Number(existingItem.orderedMenuItem.menuPrice) * MAX_ORDER_NUMBER,
          Number(existingItem.orderedMenuItem.menuPrice) * updateQuantity
        )

        const updatedItem = {
          ...existingItem,
          itemQuantity: String(updateQuantity),
          itemPrice: String(updatePrice),
        }

        const updatedCartItems = [...cart.cartItems]
        updatedCartItems[existingItemIndex] = updatedItem

        setCart({
          ...cart,
          cartItems: updatedCartItems,
        })
      }

      toast.success(`장바구니에 ${menuName} ${amount}개가 추가되었습니다.`)
    } else {
      const price = Number(menuPrice) * amount
      const newItem = {
        orderedMenuItem: {
          menuId,
          menuName,
          menuDescription,
          menuPrice,
          menuImageUrl,
        },
        itemQuantity: String(amount),
        itemPrice: String(price),
      }

      setCart({
        ...cart,
        cartItems: [...cart.cartItems, newItem],
        cartItemCount: String(Number(cart.cartItemCount) + amount),
        totalPrice: String(Number(cart.totalPrice) + Number(menuPrice)),
      })

      toast.success(`장바구니에 ${menuName} ${amount}개가 추가되었습니다.`)
    }
  }

  const onRemoveFromCart = debounce((menuId) => {
    // 메뉴 아이디(menuId)를 사용하여 삭제할 아이템을 찾습니다.
    const itemIndexToRemove = cart.cartItems.findIndex(
      (item) => item.orderedMenuItem.menuId === menuId
    )

    if (itemIndexToRemove === -1) {
      // 해당 메뉴가 장바구니에 없으면 아무것도 하지 않습니다.
      return
    }

    // 삭제할 아이템을 제외한 새로운 배열을 생성합니다.
    const updatedCartItems = cart.cartItems.filter(
      (item, index) => index !== itemIndexToRemove
    )

    // 삭제된 메뉴의 수량과 가격을 계산하여 전체 장바구니 정보를 업데이트합니다.
    const removedItem = cart.cartItems[itemIndexToRemove]
    const removedItemPrice = Number(removedItem.itemPrice)
    const updatedCartCount = Number(cart.cartItemCount) - 1
    const updatedTotalPrice = Number(cart.totalPrice) - removedItemPrice

    // 상태를 업데이트합니다.
    setCart({
      ...cart,
      cartItems: updatedCartItems,
      cartItemCount: String(updatedCartCount),
      totalPrice: String(updatedTotalPrice),
    })
  }, 150)

  const onUpdateCartItemQuantity = debounce((menuId, newQuantity) => {
    // 메뉴 아이디(menuId)를 사용하여 업데이트할 아이템을 찾습니다.
    const updatedCartItems = cart.cartItems.map((item) => {
      if (item.orderedMenuItem.menuId === menuId) {
        // 업데이트할 아이템을 찾았으면 새로운 객체를 생성하여 수량을 업데이트합니다.
        const updatedItem = {
          ...item,
          itemQuantity: String(newQuantity),
          itemPrice: String(
            Number(item.orderedMenuItem.menuPrice) * newQuantity
          ),
        }
        return updatedItem
      }
      // 업데이트하지 않을 아이템은 그대로 반환합니다.
      return item
    })

    // 전체 장바구니 정보를 업데이트합니다.
    const updatedTotalPrice = updatedCartItems.reduce(
      (total, item) => total + Number(item.itemPrice),
      0
    )

    // 상태를 업데이트합니다.
    setCart({
      ...cart,
      cartItems: updatedCartItems,
      totalPrice: String(updatedTotalPrice),
    })
  }, 150)

  const onResetCart = () => {
    setCart({
      cartItems: [],
      cartItemCount: '0',
      totalPrice: '0',
    })
  }

  return {
    cart,
    onResetCart,
    onAddToCart,
    onRemoveFromCart,
    onUpdateCartItemQuantity,
  }
}

export default useShoppingCart
