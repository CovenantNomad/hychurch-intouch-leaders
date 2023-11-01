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

interface CellDallantScreenProps {}

const CellDallantScreen = ({}: CellDallantScreenProps) => {
  const userInfo = useRecoilValue(stateUserInfo)
  const { isLoading, cellInfo, cellMember } = useCellDallant()

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
      <CellDallantHeader isLoading={isLoading} cellInfo={cellInfo} />
      <Spacer size={'h-4 lg:h-8'} />
      <h3 className="text-lg font-sans font-medium">셀원 달란트 통장</h3>
      <Spacer size={'h-2 lg:h-3'} />
      <CellDallantList isLoading={isLoading} cellMember={cellMember} />
      <Spacer size={'h-6 lg:h-8'} />
    </Container>
  )
}

export default CellDallantScreen
