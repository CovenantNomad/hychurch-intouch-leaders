import React, { useState } from 'react'
import Spacer from '@/components/Atoms/Spacer'
import Tabs from '@/components/Atoms/Tabs/Tabs'
import SectionTitle from '@/components/Atoms/Typography/SectionTitle'
import CellTransferAccept from '@/components/Organisms/Cell/CellTransferAccept'
import CellTransferHistory from '@/components/Organisms/Cell/CellTransferHistory'
import CellTransferRegister from '@/components/Organisms/Cell/CellTransferRegister'
import { cellTransferTabs } from '@/constants/menu'

interface CellTransferScreenProps {}

const CellTransferScreen = ({}: CellTransferScreenProps) => {
  const [tabIdx, setTabIdx] = useState<number>(0)
  const categories = [
    {
      id: 0,
      name: '이동신청',
      component: <CellTransferRegister />,
    },
    {
      id: 1,
      name: '이동승인',
      component: <CellTransferAccept />,
    },
    {
      id: 2,
      name: '이동결과',
      component: <CellTransferHistory />,
    },
  ]

  return (
    <>
      <SectionTitle title="셀원 이동" />
      <Spacer size={'h-3'} />
      <Tabs tabs={cellTransferTabs} tabIdx={tabIdx} setSelect={setTabIdx} />
      <Spacer size={'h-8 lg:h-12'} />
      {categories[tabIdx].component}
    </>
  )
}

export default CellTransferScreen
