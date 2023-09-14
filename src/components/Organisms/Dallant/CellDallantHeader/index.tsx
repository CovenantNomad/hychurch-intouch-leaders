import React from 'react'
import EmptyStateSimple from '@/components/Atoms/EmptyStates/EmptyStateSimple'
import { DallantCellType } from '@/types/dallant'

interface CellDallantHeaderProps {
  isLoading: boolean
  cellInfo: DallantCellType | null
}

const CellDallantHeader = ({ isLoading, cellInfo }: CellDallantHeaderProps) => {
  return (
    <div>
      {isLoading ? (
        <div className="animate-pulse flex flex-col justify-center items-center space-y-3 py-6 rounded-xl bg-[#F7F7F7] shadow-sm">
          <div className="h-[6px] w-1/4 bg-slate-200 rounded"></div>
          <div className="h-3 w-1/3 bg-slate-200 rounded"></div>
        </div>
      ) : (
        <div>
          {cellInfo ? (
            <div className="flex flex-col justify-center items-center py-6 rounded-xl bg-[#F7F7F7]">
              <p className="text-sm font-sans">우리셀 총 달란트</p>
              <p className="text-2xl font-sans font-bold mt-1">
                {cellInfo.totalAmount.toLocaleString('kr-KR')} D
              </p>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center py-2 rounded-xl bg-[#F7F7F7]">
              <EmptyStateSimple />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CellDallantHeader
