import React, { useCallback } from 'react'
import { useRouter } from 'next/router'
import { AttendanceGlobalState } from '@/types/attendance'

interface AttendanceCompleteProps {
  attendance: AttendanceGlobalState
}

const AttendanceComplete = ({ attendance }: AttendanceCompleteProps) => {
  const router = useRouter()

  const onCloseHandler = useCallback(() => {
    router.push('/home')
  }, [])

  return (
    <div>
      <h6 className="mt-8 underline-offset-4 underline">
        예배출석 일자 : {attendance.submitDate}
      </h6>
      <h6 className="mt-6 font-bold">제출명단</h6>
      <ul className="mt-2 bg-gray-50 shadow-sm divide-y divide-gray-100">
        {attendance.attendanceList !== null &&
          attendance.attendanceList.length !== 0 &&
          attendance.attendanceList.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center px-4 py-5 hover:bg-gray-100 sm:px-6"
            >
              <p>{item.user.name}</p>
              <p>
                {item.churchService.name}
                <span
                  className={`rounded-md whitespace-nowrap ml-2.5 px-1.5 py-0.5 text-xs font-medium ${
                    item.isOnline
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {item.isOnline ? '성전' : '온라인'}
                </span>
              </p>
            </li>
          ))}
      </ul>
      <div className="mt-16">
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
