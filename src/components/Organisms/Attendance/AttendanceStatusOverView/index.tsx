import Skeleton from '@/components/Atoms/Skeleton'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import useAttendance from '@/hooks/useAttendance'
import useCellMeeting from '@/hooks/useCellMeeting'
import { AttendanceStatus } from '@/types/attendance'
import { LoginUser } from '@/types/auth'
import React from 'react'

type AttendanceStatusOverViewProps = {
  userInfo: LoginUser | null
}

const AttendanceStatusOverView = ({
  userInfo,
}: AttendanceStatusOverViewProps) => {
  const { attendance } = useAttendance()
  const { isCellMeetingSubmissionLoading, cellMeetingSubmission } =
    useCellMeeting({ cellId: String(userInfo?.cell?.id) })

  return (
    <Card className="lg:flex lg:justify-between lg:items-center">
      <CardHeader className="py-3">
        <CardTitle className="text-lg">제출현황</CardTitle>
        {/* <CardDescription>Card Description</CardDescription> */}
      </CardHeader>
      <CardContent className="space-y-2 lg:flex lg:py-4 lg:pl-0 lg:pr-6 lg:space-y-0  lg:space-x-4">
        <div className="flex justify-between items-center rounded-md border px-4 py-3">
          <p className="text-sm">예배 출석체크</p>
          {attendance.status === AttendanceStatus.COMPLETE ? (
            <Badge
              variant={'default'}
              className="bg-green-50 px-2 py-1 text-xs font-medium text-green-700"
            >
              완료
            </Badge>
          ) : (
            <>
              {attendance.status === AttendanceStatus.NOT_SUBMITTED && (
                <Badge
                  variant={'default'}
                  className="bg-red-50 px-2 py-1 text-xs font-medium text-red-700"
                >
                  미제출
                </Badge>
              )}
              {attendance.status === AttendanceStatus.TEMPORARY_SAVE && (
                <Badge
                  variant={'default'}
                  className="bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700"
                >
                  작성중
                </Badge>
              )}
            </>
          )}
        </div>
        <div className="flex justify-between items-center rounded-md border px-4 py-3">
          <p className="text-sm">셀모임 출석체크</p>
          {isCellMeetingSubmissionLoading ? (
            <Skeleton className="w-[49px] h-[26px] bg-gray-100 rounded-full" />
          ) : (
            <>
              {cellMeetingSubmission &&
              cellMeetingSubmission.submissionStatus ? (
                <Badge
                  variant={'default'}
                  className="bg-green-50 px-2 py-1 text-xs font-medium text-green-700"
                >
                  완료
                </Badge>
              ) : (
                <Badge
                  variant={'default'}
                  className="bg-red-50 px-2 py-1 text-xs font-medium text-red-700"
                >
                  미제출
                </Badge>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default AttendanceStatusOverView
