import React from 'react'
import { useRouter } from 'next/router'
//api
import { useQuery } from '@tanstack/react-query'
import { getMenuById } from '@/firebase/dallant/cellday'
//component
import CellDayMenuBody from '@/components/Organisms/Dallant/CellDayMenuBody'
import CellDayMenuHeader from '@/components/Organisms/Dallant/CellDayMenuHeader'
import EmptyStateSimple from '@/components/Atoms/EmptyStates/EmptyStateSimple'

interface CellDayMenuDetailScreenProps {}

const CellDayMenuDetailScreen = ({}: CellDayMenuDetailScreenProps) => {
  const router = useRouter()
  const {
    restaurantId,
    menuId,
    menuName,
    menuDescription,
    menuPrice,
    menuImageUrl,
  } = router.query

  const { isLoading, isFetching, data } = useQuery(
    ['getUserDallantHistory', restaurantId, menuId],
    () => getMenuById(String(restaurantId), String(menuId)),
    {
      enabled: !!restaurantId && !!menuId,
      staleTime: 15 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
    }
  )

  if (menuName && menuDescription && menuPrice && menuImageUrl) {
    return (
      <div>
        <>
          <CellDayMenuHeader
            menuImageUrl={String(menuImageUrl)}
            goBack={() => router.back()}
          />
          <CellDayMenuBody
            menuId={String(menuId)}
            menuName={String(menuName)}
            menuDescription={String(menuDescription)}
            menuPrice={String(menuPrice)}
            menuImageUrl={String(menuImageUrl)}
            restaurantId={String(restaurantId)}
          />
        </>
      </div>
    )
  }

  return (
    <div>
      {isLoading || isFetching ? (
        <div className="animate-pulse">
          <div className="animate-pulse w-full h-[300px] bg-gray-200" />
          <div className="w-1/6 h-1.5 bg-gray-200 mt-6 ml-4" />
          <div className="w-1/2 h-1.5 bg-gray-200 mt-6 ml-4" />
          <div className="w-1/3 h-1.5 bg-gray-200 mt-6 ml-4" />
        </div>
      ) : (
        <>
          {data ? (
            <>
              <CellDayMenuHeader
                menuImageUrl={data.menuImageUrl}
                goBack={() => router.back()}
              />
              <CellDayMenuBody
                menuId={data.menuId}
                menuName={data.menuName}
                menuDescription={data.menuDescription}
                menuPrice={data.menuPrice}
                menuImageUrl={data.menuImageUrl}
                restaurantId={data.restaurantId}
              />
            </>
          ) : (
            <EmptyStateSimple />
          )}
        </>
      )}
    </div>
  )
}

export default CellDayMenuDetailScreen
