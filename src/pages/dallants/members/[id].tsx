import React from 'react'
import Head from 'next/head'
import Layout from '@/components/Atoms/Layout/Layout'
import UserDallantScreen from '@/components/Templates/Dallant/UserDallantScreen'

interface DallantDetailProps {}

const DallantDetail = ({}: DallantDetailProps) => {
  return (
    <Layout>
      <Head>
        <title>달란트 통장 | INTOUCH CHURCH</title>
      </Head>
      <UserDallantScreen />
    </Layout>
  )
}

export default DallantDetail
