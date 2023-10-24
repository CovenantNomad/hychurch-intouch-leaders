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
          />
        </>
      </div>
    )
  }

  return (
    <div>
      {isLoading || isFetching ? (
        <div>로딩중</div>
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
