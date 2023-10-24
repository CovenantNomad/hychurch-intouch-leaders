import React from 'react'
//api
import { useQuery } from '@tanstack/react-query'
import { getRestaurants } from '@/firebase/dallant/cellday'
//component
import Container from '@/components/Atoms/Container/Container'
import InformationAlerts from '@/components/Atoms/Alerts/InformationAlerts'
import EmptyStateSimple from '@/components/Atoms/EmptyStates/EmptyStateSimple'
import CellDayMenus from '@/components/Organisms/Dallant/CellDayMenus'

interface CellDayMenuScreenProps {}

const CellDayMenuScreen = ({}: CellDayMenuScreenProps) => {
  const { isLoading, isFetching, data } = useQuery(
    ['getRestaurants'],
    getRestaurants,
    {
      staleTime: 15 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
    }
  )

  return (
    <div>
      {isLoading || isFetching ? (
        <div className="py-8">
          <Container>
            <div className="animate-pulse flex py-6 px-10 rounded-xl bg-[#F7F7F7]">
              <div className="flex-1">
                <div className="h-[8px] w-1/4 bg-slate-200 rounded"></div>
                <div className="h-[6px] w-1/2 bg-slate-200 rounded justify-items-end mt-5"></div>
                <div className="h-[6px] w-1/4 bg-slate-200 rounded justify-items-end mt-8"></div>
              </div>
              <div className="w-[110px] h-[100px] bg-slate-200/60 rounded-md" />
            </div>
            <div className="animate-pulse flex py-6 px-10 mt-6 rounded-xl bg-[#F7F7F7] ">
              <div className="flex-1">
                <div className="h-[8px] w-1/4 bg-slate-200 rounded"></div>
                <div className="h-[6px] w-1/2 bg-slate-200 rounded justify-items-end mt-5"></div>
                <div className="h-[6px] w-1/4 bg-slate-200 rounded justify-items-end mt-8"></div>
              </div>
              <div className="w-[110px] h-[100px] bg-slate-200/60 rounded-md" />
            </div>
          </Container>
        </div>
      ) : (
        <div>
          {data ? (
            <div>
              <InformationAlerts description="꼭 공지사항을 숙지하시고 주문해주세요." />
              {data
                .sort((a, b) => {
                  return Number(a.ordered) - Number(b.ordered)
                })
                .map((restaurant) => (
                  <div
                    key={restaurant.restaurantId}
                    className="py-8 border-b-8 last:border-b-0"
                  >
                    <Container>
                      <h3 className="text-lg leading-6 mb-6">
                        {restaurant.restaurantName}
                      </h3>
                      <div className="divide-y">
                        {restaurant.menu.length !== 0 ? (
                          <div>
                            {restaurant.menu.map((menu) => (
                              <CellDayMenus
                                key={menu.menuId}
                                menu={menu}
                                restaurantId={restaurant.restaurantId}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
                              />
                            </svg>
                            <span className="mt-2 block text-sm font-semibold text-gray-900">
                              아직 메뉴가 등록되지 않았습니다
                            </span>
                          </div>
                        )}
                      </div>
                    </Container>
                  </div>
                ))}
            </div>
          ) : (
            <div className="py-8">
              <EmptyStateSimple />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CellDayMenuScreen
