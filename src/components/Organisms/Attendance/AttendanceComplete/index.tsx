import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { AttendanceGlobalState, AttendanceHistory } from '@/types/attendance'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getServiceName } from '@/utils/utils'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import Spacer from '@/components/Atoms/Spacer'
import { cn } from '@/lib/utils'
import { formatKoreanDate } from '@/utils/dateUtils'

type AttendanceCompleteProps = {
  attendance: AttendanceGlobalState
}

type GroupedAttendance = {
  [key: string]: AttendanceHistory[]
}

const AttendanceComplete = ({ attendance }: AttendanceCompleteProps) => {
  const router = useRouter()
  const [groupedAttendance, setGroupedAttendance] = useState<GroupedAttendance>(
    {}
  )

  const onCloseHandler = useCallback(() => {
    router.push('/home')
  }, [])

  const groupAttendanceByService = (
    attendanceList: AttendanceHistory[] | null
  ): GroupedAttendance => {
    const grouped: GroupedAttendance = {}

    if (attendanceList) {
      attendanceList.forEach((history) => {
        const serviceId = history.churchService.id
        if (!grouped[serviceId]) {
          grouped[serviceId] = []
        }
        grouped[serviceId].push(history)
      })
    }

    return grouped
  }

  useEffect(() => {
    const groupedList = groupAttendanceByService(attendance.attendanceList)
    setGroupedAttendance(groupedList)
  }, [attendance.attendanceList])

  return (
    <div>
      <Alert>
        <AlertTitle>예배 출석체크 완료!</AlertTitle>
        <AlertDescription>
          <span className="text-bold underline">
            {formatKoreanDate(attendance.submitDate)}
          </span>{' '}
          제출명단은 아래에서 확인할 수 있습니다
        </AlertDescription>
      </Alert>
      <div className="mt-4 space-y-2 lg:mt-8 lg:space-y-4">
        {Object.keys(groupedAttendance).map((serviceId) => (
          <Card key={serviceId}>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">
                {getServiceName(serviceId)}{' '}
                <span className="text-base ml-1">
                  ({groupedAttendance[serviceId].length}명)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-4 gap-4 px-4 lg:grid-cols-6">
              {groupedAttendance[serviceId]
                .sort((a, b) => a.user.name.localeCompare(b.user.name))
                .map((member) => (
                  <div
                    key={member.id}
                    className={cn(
                      'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border transition-colors focus-visible:outline-none bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2',
                      `${member.isOnline ? 'bg-yellow-50' : 'bg-blue-50'}`
                    )}
                  >
                    {member.user.name}
                  </div>
                ))}
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8">
        <button
          onClick={onCloseHandler}
          className="w-full bg-blue-500 text-white py-2 text-sm rounded-lg"
        >
          홈으로
        </button>
      </div>
    </div>
  )
}

export default AttendanceComplete
