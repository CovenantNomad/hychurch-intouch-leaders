import React from 'react'
import Head from 'next/head'
import { useRecoilState, useRecoilValue } from 'recoil'
import { stateUserInfo } from '@/stores/stateUserInfo'
import { stateSetting } from '@/stores/stateSetting'
//components
import Layout from '@components/Atoms/Layout/Layout'
import CellInfomationScreen from '@components/Templates/Cell/CellInformationScreen'
import CellTransferScreen from '@components/Templates/Cell/CellTransferScreen'
import Container from '@components/Atoms/Container/Container'
import Spacer from '@components/Atoms/Spacer'
import CellMemberListScreen from '@/components/Templates/Cell/CellMemberListScreen'
import GridMenu from '@components/Atoms/GridMenu/GridMenu'
import { cellMenu } from '@/constants/menu'
import CellEvaluationScreen from '@/components/Templates/Cell/CellEvaluationScreen'

const categories = [
  {
    id: 0,
    name: '셀 정보',
    component: <CellInfomationScreen />,
  },
  {
    id: 1,
    name: '셀원 정보',
    component: <CellMemberListScreen />,
  },
  {
    id: 2,
    name: '셀원 이동',
    component: <CellTransferScreen />,
  },
  {
    id: 3,
    name: '셀평가서',
    component: <CellEvaluationScreen />,
  },
]

const Cell = () => {
  const userInfo = useRecoilValue(stateUserInfo)
  const [setting, setSetting] = useRecoilState(stateSetting)

  return (
    <Layout>
      <Head>
        <title>
          셀원관리 - {categories[setting.cellSelectedCategoryId].name} | INTOUCH
          CHURCH
        </title>
      </Head>

      <Spacer size={'h-2 lg:h-6'} />
      <h4 className="text-2xl font-bold tracking-wide px-4 md:px-6 lg:px-8">
        {userInfo?.cell?.name || '셀이름'}
      </h4>
      <Spacer size={'h-6'} />
      <div className="relative pl-4">
        <GridMenu
          menuList={cellMenu}
          onSelectHandler={(id: number) =>
            setSetting({ ...setting, cellSelectedCategoryId: id })
          }
        />
      </div>
      <Spacer />
      <Container>
        {categories[setting.cellSelectedCategoryId].component}
      </Container>
    </Layout>
  )
}

export default Cell
