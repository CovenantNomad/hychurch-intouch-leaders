import React from 'react'
//hook
import useCellDallant from '@/hooks/useCellDallant'
//state
import { useRecoilValue } from 'recoil'
import { stateUserInfo } from '@/stores/stateUserInfo'
//components
import Spacer from '@/components/Atoms/Spacer'
import CellDallantHeader from '@/components/Organisms/Dallant/CellDallantHeader'
import CellDallantList from '@/components/Organisms/Dallant/CellDallantList'
import Container from '@/components/Atoms/Container/Container'
import { useQuery } from '@tanstack/react-query'
import { getDallentSetting } from '@/firebase/dallant/dallant'
import Spinner from '@/components/Atoms/Spinner'

interface CellDallantScreenProps {}

const CellDallantScreen = ({}: CellDallantScreenProps) => {
  const userInfo = useRecoilValue(stateUserInfo)
  const { isLoading, cellInfo, cellMember } = useCellDallant()

  const {
    isLoading: isSettingLoading,
    isFetching: isSettingFetching,
    data: settings,
  } = useQuery(['getDallantSetting'], getDallentSetting, {
    staleTime: 15 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  })

  return (
    <Container>
      <Spacer size={'h-3 lg:h-6'} />
      <h2 className="flex items-center gap-x-3 text-2xl font-bold tracking-wide">
        {userInfo?.cell?.name || '셀이름'}{' '}
        <span className="text-sm font-medium bg-gray-100 py-1 px-3 rounded-3xl">
          달란트 통장
        </span>
      </h2>
      <Spacer size={'h-6'} />
      {isSettingLoading || isSettingFetching ? (
        <div className="flex justify-center items-center py-6">
          <Spinner />
        </div>
      ) : (
        <>
          {settings && settings.isActivity ? (
            <>
              <CellDallantHeader isLoading={isLoading} cellInfo={cellInfo} />
              <Spacer size={'h-4 lg:h-8'} />
              <h3 className="text-lg font-sans font-medium">
                셀원 달란트 통장
              </h3>
              <Spacer size={'h-2 lg:h-3'} />
              <CellDallantList isLoading={isLoading} cellMember={cellMember} />
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
        </>
      )}
      <Spacer size={'h-6 lg:h-8'} />
    </Container>
  )
}

export default CellDallantScreen
