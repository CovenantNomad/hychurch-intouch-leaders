import Spacer from '@/components/Atoms/Spacer'
import Tabs from '@/components/Atoms/Tabs/Tabs'
import SectionTitle from '@/components/Atoms/Typography/SectionTitle'
import React, { useState } from 'react'
import CellEvaluationFormEntry from '@/components/Organisms/Cell/CellEvaluationForm/CellEvaluationFormEntry'
import CellEvaluationFormViewer from '@/components/Organisms/Cell/CellEvaluationForm/CellEvaluationFormViewer'
import { cellEvaluationTabs } from '@/constants/menu'

type CellEvaluationScreenProps = {}

const CellEvaluationScreen = ({}: CellEvaluationScreenProps) => {
  const [tabIdx, setTabIdx] = useState<number>(0)

  const categories = [
    {
      id: 0,
      name: '셀평가서 작성',
      component: <CellEvaluationFormEntry />,
    },
    {
      id: 1,
      name: '셀평가서 열람',
      component: <CellEvaluationFormViewer />,
    },
  ]

  return (
    <>
      <SectionTitle title="셀 편성을 위한 셀평가서" />
      <Spacer size={'h-3'} />
      <Tabs tabs={cellEvaluationTabs} tabIdx={tabIdx} setSelect={setTabIdx} />
      <Spacer size={'h-8 lg:h-12'} />
      {categories[tabIdx].component}
    </>
  )
}

export default CellEvaluationScreen
