import React from 'react'
import Head from 'next/head'
//components
import Layout from '@components/Atoms/Layout/Layout'
import CellDallantScreen from '@/components/Templates/Dallant/CellDallantScreen'
import GridMenu from '@/components/Atoms/GridMenu/GridMenu'
import CellDayScreen from '@/components/Templates/Dallant/CellDayScreen/CellDayScreen'
import { useRecoilValue } from 'recoil'
import { stateSetting } from '@/stores/stateSetting'
import { dallantMenu } from '@/constants/menu'
import Spacer from '@/components/Atoms/Spacer'
import { stateUserInfo } from '@/stores/stateUserInfo'

interface DallantPageProps {}

const categories = [
  {
    id: 0,
    name: '달란트통장',
    component: <CellDallantScreen />,
  },
  {
    id: 1,
    name: '셀모임의 날',
    component: <CellDayScreen />,
  },
]

const DallantPage = ({}: DallantPageProps) => {
  const setting = useRecoilValue(stateSetting)
  const userInfo = useRecoilValue(stateUserInfo)

  return (
    <Layout>
      <Head>
        <title>달란트관리 | INTOUCH CHURCH</title>
      </Head>

      <Spacer size={'h-2 lg:h-6'} />
      <h4 className="text-2xl font-bold tracking-wide px-4 md:px-6 lg:px-8">
        {userInfo?.cell?.name || '셀이름'}
      </h4>
      <Spacer size={'h-6'} />
      <div className="relative pl-4">
        <GridMenu menuList={dallantMenu} />
      </div>
      <Spacer />
      <>{categories[setting.cellSelectedCategoryId].component}</>
    </Layout>
  )
}

export default DallantPage
