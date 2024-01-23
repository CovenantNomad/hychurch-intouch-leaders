import SimpleStats from '@/components/Atoms/Stats/SimpleStats'
import React from 'react'

interface CellStatsGroupProps {
  totalNumber: number
  activeNumber: number
}

const CellStatsGroup = ({ totalNumber, activeNumber }: CellStatsGroupProps) => {
  return (
    <div className="grid grid-cols-3 gap-x-4">
      <SimpleStats title="전체인원" number={totalNumber} />
      <SimpleStats title="셀보고서 포함" number={activeNumber} />
      <SimpleStats title="미포함" number={totalNumber - activeNumber} />
    </div>
  )
}

export default CellStatsGroup
