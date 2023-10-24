import React, { useState } from 'react'
import Container from '@/components/Atoms/Container/Container'
import CellDayHeader from '@/components/Organisms/Dallant/CellDayHeader'
import CellDayMenuScreen from '../CellDayMenuScreen'
import CellDayOrderScreen from '../CellDayOrderScreen'
import CellDayCartScreen from '../CellDayCartScreen'
import { getDallentSetting } from '@/firebase/dallant/dallant'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import CellDayNoticeScreen from '../CellDayNoticeScreen'

interface CellDayScreenProps {}

const CellDayScreen = ({}: CellDayScreenProps) => {
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
      name: '공지사항',
      component: <CellDayNoticeScreen />,
    },
    {
      id: 3,
      name: '장바구니',
      component: <CellDayCartScreen setTabIdx={setTabIdx} />,
    },
  ]

  return (
    <div>
      {isLoading || isFetching ? (
        <div className="flex justify-center items-center py-12 animate-bounce">
          인터치 잇츠 지금 시작됩니다...
        </div>
      ) : (
        <div>
          {data && data.isCellDayOpen ? (
            <>
              <CellDayHeader tabIdx={tabIdx} setTabIdx={setTabIdx} />
              <div>{subCategories[tabIdx].component}</div>
            </>
          ) : (
            <Container>
              <div className="flex flex-col justify-center items-center py-12">
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
        </div>
      )}
    </div>
  )
}

export default CellDayScreen
