import React from 'react'
//components
import Layout from '@components/Atoms/Layout/Layout'

interface ReportsProps {}

const Reports = ({}: ReportsProps) => {
  return (
    <Layout>
      <div className="h-screen flex justify-center items-center">
        <h1 className="text-4xl font-bold">
          현재 페이지는
          <br />
          개발 중입니다
        </h1>
      </div>
    </Layout>
  )
}

export default Reports
