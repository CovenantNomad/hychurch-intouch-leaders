import React from 'react'
//components
import Layout from '@components/Atoms/Layout/Layout'
import { useRouter } from 'next/router'

interface SurveyPageProps {}

const SurveyPage = ({}: SurveyPageProps) => {
  const router = useRouter()

  return (
    <Layout>
      <div className="h-screen flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold">
          현재 페이지는
          <br />
          개발 중입니다
        </h1>
        <div className="mt-8">
          <button
            onClick={() => router.back()}
            className="border px-4 py-2 rounded-md cursor-pointer"
          >
            뒤로
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default SurveyPage
