import React from 'react'
import dayjs from 'dayjs'
import { XCircleIcon } from '@heroicons/react/20/solid'
import ShutdownAlert from '@/components/Blocks/EvaluationForm/ShutdownAlert/ShutdownAlert'
import DurationAlertCard from '@/components/Blocks/EvaluationForm/\bDurationAlertCard'

type CellEvaluationFormViewHeaderProps = {
  isLoading: boolean
  isActive: boolean | undefined
  today: dayjs.Dayjs
  viewingStartDate: dayjs.Dayjs | undefined
  viewingEndDate: dayjs.Dayjs | undefined
}

const CellEvaluationFormViewHeader = ({
  isLoading,
  isActive,
  today,
  viewingStartDate,
  viewingEndDate,
}: CellEvaluationFormViewHeaderProps) => {
  return (
    <div>
      {isLoading ? (
        <div>로딩중...</div>
      ) : (
        <>
          {isActive && today.isBefore(viewingEndDate) ? (
            <div>
              <DurationAlertCard
                title="셀원정보 열람기간입니다"
                typeText="열람기간"
                startDate={viewingStartDate}
                endDate={viewingEndDate}
                hasTimer={false}
              />
            </div>
          ) : (
            <ShutdownAlert
              title="셀 편성 기간이 아닙니다."
              subtitleOne="셀평가서 열람기간이 지났습니다"
              subtitleTwo="셀평가서는 셀편성 후 한달동안만 볼 수 있습니다"
            />
          )}
        </>
      )}
    </div>
  )
}

export default CellEvaluationFormViewHeader
