import React from 'react'
import Head from 'next/head'
import Layout from '@/components/Atoms/Layout/Layout'
import CellMemberDetailScreen from '@/components/Templates/Cell/CellMemberDetailScreen'

interface MemberPageProps {}

const MemberPage = ({}: MemberPageProps) => {
  return (
    <Layout>
      <Head>
        <title>셀원정보 | INTOUCH CHURCH</title>
      </Head>
      <CellMemberDetailScreen />
    </Layout>
  )
}

export default MemberPage
