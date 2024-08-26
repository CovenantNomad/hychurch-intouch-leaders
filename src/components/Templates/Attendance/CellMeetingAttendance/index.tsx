import { useCallback } from 'react'
//hooks
import useCellMeeting from '@/hooks/useCellMeeting'
//types
import { LoginUser } from '@/types/auth'
//components
import Skeleton from '@/components/Atoms/Skeleton'
import Spacer from '@/components/Atoms/Spacer'
import Spinner from '@/components/Atoms/Spinner'
import CellMeetingAttendanceForm from '@/components/Organisms/Attendance/CellMeetingAttendanceForm'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatKoreanDate } from '@/utils/dateUtils'
import { AlertCircle } from 'lucide-react'
import { useRouter } from 'next/router'

type CellMeetingAttendanceProps = {
  userInfo: LoginUser | null
}

const CellMeetingAttendance = ({ userInfo }: CellMeetingAttendanceProps) => {
  const {
    isSubmitting,
    isCellMeetingSubmissionLoading,
    isCellMembersLoading,
    cellMeetingSubmission,
    cellMember,
    cellMeetingAttendance,
    onCheckHandler,
    onSaveHandler,
  } = useCellMeeting({
    cellId: String(userInfo?.cell?.id),
    cellName: String(userInfo?.cell?.name),
  })

  const router = useRouter()
  const onCloseHandler = useCallback(() => {
    router.push('/home')
  }, [])

  return (
    <div>
      {isCellMeetingSubmissionLoading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : (
        <>
          {cellMeetingSubmission && cellMeetingSubmission.submissionStatus ? (
            <div>
              <Alert>
                <AlertTitle>셀모임 출석체크 완료!</AlertTitle>
                <AlertDescription>
                  <span className="text-bold underline">
                    {cellMeetingSubmission.submissionData &&
                      formatKoreanDate(
                        cellMeetingSubmission.submissionData.baseDateString
                      )}
                  </span>{' '}
                  제출명단은 아래에서 확인할 수 있습니다
                </AlertDescription>
              </Alert>
              <Spacer size="h-3 lg:h-8" />
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">
                    셀모임 참석명단{' '}
                    <span className="text-base ml-1">
                      (
                      {
                        cellMeetingSubmission.submissionData?.attendanceList
                          .length
                      }
                      명)
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-4 gap-4 px-4 lg:grid-cols-6">
                  {cellMeetingSubmission.submissionData?.attendanceList
                    .sort((a, b) => a.userName.localeCompare(b.userName))
                    .map((member) => (
                      <div
                        key={member.userId}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border transition-colors focus-visible:outline-none bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                      >
                        {member.userName}
                      </div>
                    ))}
                </CardContent>
              </Card>
              <Spacer size="h-2 lg:h-4" />
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">
                    셀모임 미참석명단{' '}
                    <span className="text-base ml-1">
                      ({cellMeetingSubmission.submissionData?.absentList.length}
                      명)
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-4 gap-4 px-4 lg:grid-cols-6">
                  {cellMeetingSubmission.submissionData?.absentList
                    .sort((a, b) => a.userName.localeCompare(b.userName))
                    .map((member) => (
                      <div
                        key={member.userId}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border transition-colors focus-visible:outline-none bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                      >
                        {member.userName}
                      </div>
                    ))}
                </CardContent>
              </Card>
              <div className="mt-8">
                <button
                  onClick={onCloseHandler}
                  className="w-full bg-blue-500 text-white py-2 text-sm rounded-lg"
                >
                  홈으로
                </button>
              </div>
            </div>
          ) : (
            <div>
              {isCellMembersLoading ? (
                <div className="border divide-y rounded-lg">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="flex justify-between px-3 py-4">
                      <Skeleton className="w-[100px] h-[20px] bg-gray-100 rounded-lg" />
                      <Skeleton className="w-[40px] h-[20px] bg-gray-100 rounded-lg" />
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {cellMember ? (
                    <>
                      <CellMeetingAttendanceForm
                        cellMember={cellMember}
                        cellMeetingAttendance={cellMeetingAttendance}
                        onCheckHandler={onCheckHandler}
                      />
                      <div className="mt-8">
                        <AlertDialog>
                          <AlertDialogTrigger
                            disabled={
                              cellMeetingAttendance.tempAttendanceList ===
                                null ||
                              cellMeetingAttendance.tempAttendanceList
                                .length === 0
                            }
                            className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:bg-gray-600"
                          >
                            제출
                          </AlertDialogTrigger>
                          <AlertDialogContent className="w-[94%]">
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                셀모임 출석체크 제출 하시겠습니까?
                              </AlertDialogTitle>
                              <AlertDialogDescription className="whitespace-pre-wrap">
                                {`셀모임 출석체크를 제출하겠습니다.\n한 영혼도 빠지지 않도록 정확하게 확인 후 제출해주세요`}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>취소</AlertDialogCancel>
                              <AlertDialogAction onClick={onSaveHandler}>
                                {isSubmitting ? '제출 중...' : '제출'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </>
                  ) : (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>
                        {`셀원 데이터가 존재하지 않거나 셀원 데이터를 조회하지 못했습니다`}
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default CellMeetingAttendance
