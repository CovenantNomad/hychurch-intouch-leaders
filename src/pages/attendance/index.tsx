import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRecoilValue } from 'recoil'
import { stateUserInfo } from '@/stores/stateUserInfo'
//hooks
import useAttendance from '@/hooks/useAttendance'
//components
import Layout from '@components/Atoms/Layout/Layout'
import Spacer from '@/components/Atoms/Spacer'
import Container from '@components/Atoms/Container/Container'
import AttendanceForm from '@/components/Organisms/Attendance/AttendanceForm'
import AttendancePreview from '@/components/Organisms/Attendance/AttendancePreview'
import AttendanceComplete from '@/components/Organisms/Attendance/AttendanceComplete'
import Steps from '@/components/Blocks/Steps'
import ListAlerts from '@/components/Atoms/Alerts/ListAlerts'
import SuccessAlerts from '@/components/Atoms/Alerts/SuccessAlerts'
import InformationAlerts from '@/components/Atoms/Alerts/InformationAlerts'
import DescriptionAlerts from '@/components/Atoms/Alerts/DescriptionAlerts'
import Spinner from '@/components/Atoms/Spinner'
//etc..
import { AttendanceSteps } from '@/constants/menu'
import { AttendanceStatus } from '@/types/attendance'
import {
  FindmyCellAttendanceQuery,
  FindmyCellAttendanceQueryVariables,
  useFindmyCellAttendanceQuery,
} from '@/graphql/generated'
import graphlqlRequestClient from '@/client/graphqlRequestClient'

interface AttendanceProps {}

const AttendancePage = ({}: AttendanceProps) => {
  const userInfo = useRecoilValue(stateUserInfo)
  const { attendance, setAttendance } = useAttendance()
  const [stepIdx, setStepIdx] = useState<number>(0)
  const categories = [
    {
      id: 0,
      name: 'Attendance',
      component: <AttendanceForm setStepIdx={setStepIdx} />,
    },
    {
      id: 1,
      name: 'Preview',
      component: <AttendancePreview setStepIdx={setStepIdx} />,
    },
    {
      id: 2,
      name: 'Preview',
      component: <AttendanceComplete />,
    },
  ]

  const { isLoading, data } = useFindmyCellAttendanceQuery<
    FindmyCellAttendanceQuery,
    FindmyCellAttendanceQueryVariables
  >(
    graphlqlRequestClient,
    {
      attendanceDate: attendance.submitDate,
    },
    {
      enabled: Boolean(attendance.submitDate),
      staleTime: 10 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
    }
  )

  useEffect(() => {
    if (!isLoading) {
      switch (data?.myCellAttendance.__typename) {
        case 'CellAttendanceNotSubmitted':
          setAttendance({
            ...attendance,
            status: AttendanceStatus.NOT_SUBMITTED,
          })
          break
        case 'CellAttendanceTempSaved':
          setAttendance({
            ...attendance,
            status: AttendanceStatus.TEMPORARY_SAVE,
            tempAttendanceList:
              data.myCellAttendance.tempSavedAttendanceHistories,
            attendanceList: null,
          })
          break

        case 'CellAttendanceCompleted':
          setAttendance({
            ...attendance,
            status: AttendanceStatus.COMPLETE,
            tempAttendanceList: null,
            attendanceList: data.myCellAttendance.userChurchServiceHistories,
          })
          break

        default:
          break
      }
    }
  }, [data])

  console.log(attendance.attendanceList)

  return (
    <Layout>
      <Head>
        <title>출석체크 | INTOUCH CHURCH</title>
      </Head>
      <Container>
        <Spacer size={'h-3 lg:h-6'} />
        <h4 className="text-2xl font-bold tracking-wide">
          {userInfo?.cell?.name || '셀이름'}
        </h4>
        <Spacer size={'h-4 lg:h-8'} />
        <InformationAlerts
          description={`셀원 출석체크는 매주 화요일까지 제출해주세요!\n수요일부터 수정 및 제출이 불가합니다`}
        />
        <Spacer size={'h-6 lg:h-8'} />
        {attendance.status === AttendanceStatus.COMPLETE ? (
          <SuccessAlerts
            description="이번주 출석체크 제출을 완료하였습니다."
            linkText="수정제출"
          />
        ) : (
          <>
            {attendance.status === AttendanceStatus.NOT_SUBMITTED && (
              <ListAlerts title={'이번주 예배출석을 확인하지 않았습니다'}>
                <li>{attendance.submitDate} 출석체크를 제출해주세요</li>
              </ListAlerts>
            )}
            {attendance.status === AttendanceStatus.TEMPORARY_SAVE && (
              <DescriptionAlerts
                description="작성 중인 출석체크가 존재합니다."
                accentText="이어서 출석체크를 작성하시고 최종제출 해주세요"
              />
            )}
            <Spacer size={'h-6 lg:h-12'} />
            <div>
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
            </div>
          </>
        )}
      </Container>
    </Layout>
  )
}

export default AttendancePage
