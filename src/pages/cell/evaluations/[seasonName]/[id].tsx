import React from 'react'
import Head from 'next/head'
import Layout from '@/components/Atoms/Layout/Layout'
import CellEvaluationDetailScreen from '@/components/Templates/Cell/CellEvaluationDetailScreen'

const EvaluationFormPage = () => {
  return (
    <Layout>
      <Head>
        <title>셀원정보 | INTOUCH CHURCH</title>
      </Head>
      <CellEvaluationDetailScreen />
    </Layout>
  )
}

export default EvaluationFormPage
