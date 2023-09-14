import React from 'react'
import Head from 'next/head'
//components
import Layout from '@components/Atoms/Layout/Layout'
import CellDallantScreen from '@/components/Templates/Dallant/CellDallantScreen'

interface DallantPageProps {}

const DallantPage = ({}: DallantPageProps) => {
  return (
    <Layout>
      <Head>
        <title>달란트관리 | INTOUCH CHURCH</title>
      </Head>

      <CellDallantScreen />
    </Layout>
  )
}

export default DallantPage
