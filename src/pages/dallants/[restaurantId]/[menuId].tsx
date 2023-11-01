import React from 'react'
import Head from 'next/head'
//component
import Layout from '@/components/Atoms/Layout/Layout'
import CellDayMenuDetailScreen from '@/components/Templates/Dallant/CellDayMenuDetailScreen'

interface MenuScreenProps {}

const MenuScreen = ({}: MenuScreenProps) => {
  return (
    <Layout>
      <Head>
        <title>인터치 잇츠 | INTOUCH CHURCH</title>
      </Head>
      <CellDayMenuDetailScreen />
    </Layout>
  )
}

export default MenuScreen
