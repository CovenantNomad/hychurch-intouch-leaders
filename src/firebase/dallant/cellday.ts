import { db } from '@/client/firebaseConfig'
import { DALLANTS_COLLCTION } from '@/constants/constants'
import {
  CartType,
  MenuType,
  OrderStateMentType,
  OrderStatus,
  RestaurantType,
} from '@/types/cellday'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import toast from 'react-hot-toast'

export const getRestaurants = async () => {
  try {
    const DallantSettingRef = doc(
      db,
      DALLANTS_COLLCTION.DALLENTS,
      DALLANTS_COLLCTION.SETTINGS
    )
    const docSnap = await getDoc(DallantSettingRef)

    if (docSnap.exists()) {
      if (docSnap.data().isActivity) {
        const seasonName = docSnap.data().currentSeasonName

        let restaurantList: RestaurantType[] = []

        const restaurantRef = collection(
          db,
          DALLANTS_COLLCTION.DALLENTS,
          seasonName,
          DALLANTS_COLLCTION.RESTAURANTS
        )
        const querySanpshot = await getDocs(restaurantRef)

        if (!querySanpshot.empty) {
          for (const restaurant of querySanpshot.docs) {
            const menuRef = collection(
              db,
              DALLANTS_COLLCTION.DALLENTS,
              seasonName,
              DALLANTS_COLLCTION.RESTAURANTS,
              restaurant.id,
              DALLANTS_COLLCTION.MENUS
            )
            const menuquerySnapshot = await getDocs(menuRef)

            if (!menuquerySnapshot.empty) {
              const menuTemp: MenuType[] = []
              menuquerySnapshot.forEach((menu) => {
                menuTemp.push({
                  menuId: menu.data().menuId,
                  menuName: menu.data().menuName,
                  menuDescription: menu.data().menuDescription,
                  menuPrice: menu.data().menuPrice,
                  menuImageUrl: menu.data().menuImageUrl,
                  restaurantId: restaurant.id,
                })
              })
              restaurantList.push({
                restaurantId: restaurant.data().restaurantId,
                restaurantName: restaurant.data().restaurantName,
                ordered: restaurant.data().ordered,
                menu: menuTemp,
              })
            } else {
              restaurantList.push({
                restaurantId: restaurant.data().restaurantId,
                restaurantName: restaurant.data().restaurantName,
                ordered: restaurant.data().ordered,
                menu: [],
              })
            }
          }

          return restaurantList
        } else {
          return null
        }
      }
    }
  } catch (error: any) {
    console.log('@getRestaurants Error: ', error)
    toast.error(`에러가 발생하였습니다\n${error.message.split(':')[0]}`)
  }
}

export const getMenuById = async (restaurantId: string, menuId: string) => {
  try {
    const DallantSettingRef = doc(
      db,
      DALLANTS_COLLCTION.DALLENTS,
      DALLANTS_COLLCTION.SETTINGS
    )
    const docSnap = await getDoc(DallantSettingRef)

    if (docSnap.exists()) {
      if (docSnap.data().isActivity) {
        const seasonName = docSnap.data().currentSeasonName

        let menu: MenuType

        const menuRef = doc(
          db,
          DALLANTS_COLLCTION.DALLENTS,
          seasonName,
          DALLANTS_COLLCTION.RESTAURANTS,
          restaurantId,
          DALLANTS_COLLCTION.MENUS,
          menuId
        )
        const menuDoc = await getDoc(menuRef)

        if (menuDoc.exists()) {
          menu = {
            menuId: menuDoc.data().menuId,
            menuName: menuDoc.data().menuName,
            menuDescription: menuDoc.data().menuDescription,
            menuPrice: menuDoc.data().menuPrice,
            menuImageUrl: menuDoc.data().menuImageUrl,
            restaurantId: restaurantId,
          }

          return menu
        } else {
          return null
        }
      }
    }
  } catch (error: any) {
    console.log('@getMenuById Error: ', error)
    toast.error(`에러가 발생하였습니다\n${error.message.split(':')[0]}`)
  }
}

export const createOrder = async (cellId: string, orderDocument: CartType) => {
  try {
    const DallantSettingRef = doc(
      db,
      DALLANTS_COLLCTION.DALLENTS,
      DALLANTS_COLLCTION.SETTINGS
    )
    const docSnap = await getDoc(DallantSettingRef)

    if (docSnap.exists()) {
      if (docSnap.data().isActivity) {
        const seasonName = docSnap.data().currentSeasonName

        const orderRef = collection(
          db,
          DALLANTS_COLLCTION.DALLENTS,
          seasonName,
          DALLANTS_COLLCTION.ORDER
        )
        const checkOrderStock = query(orderRef, where('cellId', '==', cellId))
        const orderQuerySnapshot = await getDocs(checkOrderStock)

        if (orderQuerySnapshot.empty) {
          const newOrderRef = doc(
            collection(
              db,
              DALLANTS_COLLCTION.DALLENTS,
              seasonName,
              DALLANTS_COLLCTION.ORDER
            )
          )
          await setDoc(newOrderRef, {
            orderNumber: newOrderRef.id,
            cellId: cellId,
            orderDocument: orderDocument,
            orderStatus: OrderStatus.COMPLETE,
            orderTime: serverTimestamp(),
          })

          const orderStockRef = collection(
            db,
            DALLANTS_COLLCTION.DALLENTS,
            seasonName,
            DALLANTS_COLLCTION.ORDERSTOCK
          )

          orderDocument.cartItems.map(async (item) => {
            const checkOrderStock = query(
              orderStockRef,
              where('menuId', '==', item.orderedMenuItem.menuId)
            )
            const querySnapshot = await getDocs(checkOrderStock)

            if (querySnapshot.empty) {
              await setDoc(
                doc(
                  db,
                  DALLANTS_COLLCTION.DALLENTS,
                  seasonName,
                  DALLANTS_COLLCTION.ORDERSTOCK,
                  item.orderedMenuItem.menuId
                ),
                {
                  menuId: item.orderedMenuItem.menuId,
                  menuName: item.orderedMenuItem.menuName,
                  restaurantId: item.orderedMenuItem.restaurantId,
                  orderUnits: Number(item.itemQuantity),
                }
              )
            } else {
              await updateDoc(
                doc(
                  db,
                  DALLANTS_COLLCTION.DALLENTS,
                  seasonName,
                  DALLANTS_COLLCTION.ORDERSTOCK,
                  item.orderedMenuItem.menuId
                ),
                {
                  orderUnits: increment(Number(item.itemQuantity)),
                }
              )
            }
          })

          toast.success(`주문이 제출되었습니다.`)
        } else {
          toast.error(`이미 주문을 제출하였습니다`)

          return
        }
      }
    }
  } catch (error: any) {
    console.log('@createOrder Error: ', error)
    toast.error(`에러가 발생하였습니다\n${error.message.split(':')[0]}`)
  }
}

export const getOrderStatement = async (cellId: string) => {
  try {
    const DallantSettingRef = doc(
      db,
      DALLANTS_COLLCTION.DALLENTS,
      DALLANTS_COLLCTION.SETTINGS
    )
    const docSnap = await getDoc(DallantSettingRef)

    if (docSnap.exists()) {
      if (docSnap.data().isActivity) {
        const seasonName = docSnap.data().currentSeasonName

        const orderRef = collection(
          db,
          DALLANTS_COLLCTION.DALLENTS,
          seasonName,
          DALLANTS_COLLCTION.ORDER
        )
        const checkOrderStock = query(orderRef, where('cellId', '==', cellId))
        const orderQuerySnapshot = await getDocs(checkOrderStock)

        if (orderQuerySnapshot.empty) {
          return {
            cellId: cellId,
            orderStatus: OrderStatus.NOT_SUBMITTED,
          }
        } else {
          let tempList: OrderStateMentType[] = []
          orderQuerySnapshot.docs.map((doc) => {
            tempList.push({
              cellId: doc.data().cellId,
              orderStatus: doc.data().orderStatus,
              orderNumber: doc.data().orderNumber,
              orderDocument: doc.data().orderDocument,
              orderTime: doc.data().orderTime,
            })
          })

          return tempList[0]
        }
      }
    }
  } catch (error: any) {
    console.log('@getOrderStatement Error: ', error)
    toast.error(`에러가 발생하였습니다\n${error.message.split(':')[0]}`)
  }
}
