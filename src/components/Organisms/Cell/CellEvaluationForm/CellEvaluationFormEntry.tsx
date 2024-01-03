import React from 'react'
import CellEvaluationFormEntryHeader from './CellEvaluationFormEntryHeader'
import CellEvaluationFormList from './CellEvaluationFormList'
import { useCheckEvaluationPeriods } from '@/hooks/useCheckEvaluationPeriods'

const CellEvaluationFormEntry = () => {
  const {
    isLoading,
    isActive,
    seasonName,
    today,
    entryStartDate,
    entryEndDate,
    statusCode,
    message,
    countDown,
    updateEntryCountdown,
  } = useCheckEvaluationPeriods()

  return (
    <div className="space-y-8">
      <CellEvaluationFormEntryHeader
        isLoading={isLoading}
        isActive={isActive}
        today={today}
        entryStartDate={entryStartDate}
        entryEndDate={entryEndDate}
        statusCode={statusCode}
        message={message}
        countDown={countDown}
        updateEntryCountdown={updateEntryCountdown}
      />
      {isActive && seasonName && (
        <CellEvaluationFormList seasonName={seasonName} />
      )}
    </div>
  )
}

export default CellEvaluationFormEntry
