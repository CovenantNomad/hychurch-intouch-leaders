import React, { useState } from 'react'
import Container from '@/components/Atoms/Container/Container'
import CellDayHeader from '@/components/Organisms/Dallant/CellDayHeader'
import CellDayMenuScreen from '../CellDayMenuScreen'
import CellDayOrderScreen from '../CellDayOrderScreen'
import CellDayCartScreen from '../CellDayCartScreen'
import { getDallentSetting } from '@/firebase/dallant/dallant'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import Spacer from '@/components/Atoms/Spacer'
import { useRecoilValue } from 'recoil'
import { stateUserInfo } from '@/stores/stateUserInfo'
// import CellDayNoticeScreen from '../CellDayNoticeScreen'

interface CellDayScreenProps {}

const CellDayScreen = ({}: CellDayScreenProps) => {
  const userInfo = useRecoilValue(stateUserInfo)
  const [tabIdx, setTabIdx] = useState<number>(0)
  const { isLoading, isFetching, data } = useQuery(
    ['getDallentSetting'],
    getDallentSetting,
    {
      staleTime: 15 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
    }
  )

  const subCategories = [
    {
      id: 0,
      name: '메뉴',
      component: <CellDayMenuScreen />,
    },
    {
      id: 1,
      name: '주문현황',
      component: <CellDayOrderScreen />,
    },
    {
      id: 2,
      name: '장바구니',
      component: <CellDayCartScreen setTabIdx={setTabIdx} />,
    },
  ]

  return (
    <Container>
      <Spacer size={'h-3 lg:h-6'} />
      <h2 className="flex items-center gap-x-3 text-2xl font-bold tracking-wide">
        {userInfo?.cell?.name || '셀이름'}{' '}
        <span className="text-sm font-medium bg-gray-100 py-1 px-3 rounded-3xl">
          셀모임의 날
        </span>
      </h2>
      <Spacer size={'h-6'} />
      {isLoading || isFetching ? (
        <div className="flex justify-center items-center py-6 animate-bounce">
          인터치 잇츠 지금 시작됩니다...
        </div>
      ) : (
        <div>
          {data && data.isActivity ? (
            <>
              {data && data.isCellDayOpen ? (
                <>
                  <CellDayHeader tabIdx={tabIdx} setTabIdx={setTabIdx} />
                  <div>{subCategories[tabIdx].component}</div>
                </>
              ) : (
                <Container>
                  <div className="flex flex-col justify-center items-center">
                    <Image
                      src={'/images/close.png'}
                      width={163}
                      height={141}
                      alt="영업종료"
                    />
                    <p className="mt-2 text-lg font-semibold text-center whitespace-pre-line">{`영업종료\n더 이상 주문을 받지 않습니다`}</p>
                  </div>
                </Container>
              )}
            </>
          ) : (
            <div className="text-center">
              <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                시즌아웃
              </h1>
              <p className="mt-6 text-sm leading-7 text-gray-600">
                지금은 달란트를 모으는 시기가 아닙니다.
                <br />
                다음에 만나요 👋🏻
              </p>
            </div>
          )}
        </div>
      )}
    </Container>
  )
}

export default CellDayScreen
