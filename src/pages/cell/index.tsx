import React, { useState } from 'react'
//components
import Layout from '@components/Atoms/Layout/Layout'
import HorizontalScrollMenu from '@components/Atoms/HorizontalScrollMenu/HorizontalScrollMenu'
import CellInfomationScreen from '@components/Templates/Cell/CellInformationScreen'
import CellTransferScreen from '@components/Templates/Cell/CellTransferScreen'
import Container from '@components/Atoms/Container/Container'
import { cellMenu } from 'src/constants/menu'
import Spacer from '@components/Atoms/Spacer'
import CellMemberListScreen from '@components/Templates/Cell/CellMemberListScreen/CellMemberListScreen'

interface CellProps {}

const Cell = ({}: CellProps) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0)
  const categories = [
    {
      id: 0,
      name: '셀 정보',
      component: <CellInfomationScreen />,
    },
    {
      id: 1,
      name: '셀원 리스트',
      component: <CellMemberListScreen />,
    },
    {
      id: 2,
      name: '셀원 이동',
      component: <CellTransferScreen />,
    },
  ]

  return (
    <Layout>
      <h4 className="text-2xl font-bold tracking-wide px-4 md:px-6 lg:px-8">
        남정훈셀
      </h4>
      <Spacer size={'h-6'} />
      <div className="relative pl-4">
        <HorizontalScrollMenu
          menuList={cellMenu}
          setSelected={setSelectedCategoryId}
        />
      </div>
      <Spacer />
      <Container>{categories[selectedCategoryId].component}</Container>
    </Layout>
  )
}

export default Cell
