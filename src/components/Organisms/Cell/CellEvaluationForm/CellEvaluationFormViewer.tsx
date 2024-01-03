import { EvaluationSettingType } from '@/types/evalutation'
import { useRouter } from 'next/router'
import React from 'react'

type CellEvaluationFormViewerProps = {}

const CellEvaluationFormViewer = ({}: CellEvaluationFormViewerProps) => {
  const router = useRouter()

  return (
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
  )
}

export default CellEvaluationFormViewer
