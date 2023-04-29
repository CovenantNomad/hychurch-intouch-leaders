import React from 'react'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import { attendanceState } from '@/stores/attendaceState'
import { CheckCircleIcon } from '@heroicons/react/20/solid'
import { AttendanceStatus } from '@/types/attendance'

interface AttendanceCompleteProps {
  sunday: string
}

const AttendanceComplete = ({ sunday }: AttendanceCompleteProps) => {
  const navigation = useRouter()
  const [attendance, setAttendance] = useRecoilState(attendanceState)

  const onCloseHandler = () => {
    setAttendance({
      status: AttendanceStatus.COMPLETED,
      attendanceList: null,
      submitDate: null,
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
              {`${sunday} 출석체크를 성공적으로 제출하였습니다.`}
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
