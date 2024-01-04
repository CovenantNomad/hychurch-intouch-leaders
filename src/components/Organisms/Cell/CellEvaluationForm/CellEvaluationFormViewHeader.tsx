import React from 'react'
import dayjs from 'dayjs'
import { ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/20/solid'
import ShutdownAlert from '@/components/Atoms/Alerts/EvaluationFormAlerts/ShutdownAlert/ShutdownAlert'
import DurationAlertCard from '@/components/Atoms/Alerts/EvaluationFormAlerts/DurationAlertCard'
import ClosureDateAlert from '@/components/Atoms/Alerts/EvaluationFormAlerts/ClosureDateAlert'
import PreStartDateAlert from '@/components/Atoms/Alerts/EvaluationFormAlerts/PreStartDateAlert'
import Skeleton from '@/components/Atoms/Skeleton'

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
        <Skeleton className="h-[105px] lg:h-[72px] bg-gray-100" />
      ) : (
        <>
          {isActive ? (
            <>
              {today.isBefore(viewingStartDate) && (
                <PreStartDateAlert
                  title={'열람기간 이전'}
                  message={'셀원정보를 열람 할 수 있는 기간이 되지 않았습니다'}
                />
              )}
              {today.isAfter(viewingStartDate) &&
                today.isBefore(viewingEndDate) && (
                  <DurationAlertCard
                    title="셀원정보 열람기간입니다"
                    typeText="열람기간"
                    startDate={viewingStartDate}
                    endDate={viewingEndDate}
                    hasTimer={false}
                  />
                )}
              {today.isAfter(viewingEndDate) && (
                <ClosureDateAlert
                  title={'열람기간 종료'}
                  message={'셀원정보를 볼 수 있는 기간이 지났습니다'}
                />
              )}
            </>
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
