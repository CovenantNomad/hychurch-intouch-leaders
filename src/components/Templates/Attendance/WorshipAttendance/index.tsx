import React, { useState } from 'react'
import Spacer from '@/components/Atoms/Spacer'
import Spinner from '@/components/Atoms/Spinner'
import Steps from '@/components/Blocks/Steps'
import AttendanceForm from '@/components/Organisms/Attendance/AttendanceForm'
import AttendancePreview from '@/components/Organisms/Attendance/AttendancePreview'
import useAttendance from '@/hooks/useAttendance'
import { AttendanceSteps } from '@/constants/menu'
import DescriptionAlerts from '@/components/Atoms/Alerts/DescriptionAlerts'
import ListAlerts from '@/components/Atoms/Alerts/ListAlerts'
import { AttendanceStatus } from '@/types/attendance'
import SuccessAlerts from '@/components/Atoms/Alerts/SuccessAlerts'
import AttendanceComplete from '@/components/Organisms/Attendance/AttendanceComplete'

type WorshipAttendanceProps = {}

const WorshipAttendance = ({}: WorshipAttendanceProps) => {
  const {
    isLoading,
    attendance,
    onCheckHandler,
    onToggleHander,
    onRemoveHandler,
    onTemporarySaveHandler,
    onSubmitHandler,
  } = useAttendance()
  const [stepIdx, setStepIdx] = useState<number>(0)
  const categories = [
    {
      id: 0,
      name: 'Attendance',
      component: (
        <AttendanceForm
          setStepIdx={setStepIdx}
          attendance={attendance}
          onCheckHandler={onCheckHandler}
          onToggleHander={onToggleHander}
        />
      ),
    },
    {
      id: 1,
      name: 'Preview',
      component: (
        <AttendancePreview
          setStepIdx={setStepIdx}
          attendance={attendance}
          onRemoveHandler={onRemoveHandler}
          onTemporarySaveHandler={onTemporarySaveHandler}
          onSubmitHandler={onSubmitHandler}
        />
      ),
    },
  ]

  return (
    <div>
      {attendance.status === AttendanceStatus.COMPLETE ? (
        <AttendanceComplete attendance={attendance} />
      ) : (
        <>
          {isLoading ? (
            <div className="flex justify-center items-center pt-12 pb-12">
              <Spinner />
            </div>
          ) : (
            <>
              <Steps
                steps={AttendanceSteps}
                stepIdx={stepIdx}
                setSelect={setStepIdx}
              />
              <Spacer size={'h-6 lg:h-8'} />
              {categories[stepIdx].component}
            </>
          )}
        </>
      )}
    </div>
  )
}

export default WorshipAttendance
