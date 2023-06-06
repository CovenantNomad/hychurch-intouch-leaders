import React from 'react'
import { useRouter } from 'next/router'
import { SetterOrUpdater, useRecoilState } from 'recoil'
import { attendanceState } from '@/stores/attendaceState'
import { CheckCircleIcon } from '@heroicons/react/20/solid'
import { AttendanceGlobalState, AttendanceStatus } from '@/types/attendance'

interface AttendanceCompleteProps {
  attendance: AttendanceGlobalState
  setAttendance: SetterOrUpdater<AttendanceGlobalState>
}

const AttendanceComplete = ({
  attendance,
  setAttendance,
}: AttendanceCompleteProps) => {
  const navigation = useRouter()

  const onCloseHandler = () => {
    setAttendance({
      ...attendance,
      status: AttendanceStatus.COMPLETE,
    })
    navigation.push('/home')
  }

  return (
    <div>
      <div className="rounded-md bg-green-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <CheckCircleIcon
              className="h-5 w-5 text-green-400"
              aria-hidden="true"
            />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-green-800">
              {`${attendance.submitDate} 출석체크를 성공적으로 제출하였습니다.`}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <button
          onClick={onCloseHandler}
          className="w-full bg-blue-500 text-white py-3"
        >
          홈으로
        </button>
      </div>
    </div>
  )
}

export default AttendanceComplete
