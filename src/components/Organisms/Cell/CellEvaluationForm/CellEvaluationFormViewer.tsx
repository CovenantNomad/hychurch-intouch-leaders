import React from 'react'
import { useCheckEvaluationPeriods } from '@/hooks/useCheckEvaluationPeriods'
import CellEvaluationFormViewHeader from './CellEvaluationFormViewHeader'
import CellEvaluationFormViewList from './CellEvaluationFormViewList'

type CellEvaluationFormViewerProps = {}

const CellEvaluationFormViewer = ({}: CellEvaluationFormViewerProps) => {
  const {
    isLoading,
    isActive,
    seasonName,
    today,
    viewingStartDate,
    viewingEndDate,
  } = useCheckEvaluationPeriods()

  return (
    <div className="space-y-8">
      <CellEvaluationFormViewHeader
        isLoading={isLoading}
        isActive={isActive}
        today={today}
        viewingStartDate={viewingStartDate}
        viewingEndDate={viewingEndDate}
      />
      {isActive && today.isBefore(viewingEndDate) && (
        <CellEvaluationFormViewList seasonName={seasonName} />
      )}
    </div>
  )
}

export default CellEvaluationFormViewer
