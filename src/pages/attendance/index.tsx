import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import dayjs from 'dayjs'
import { useRecoilValue } from 'recoil'
import { stateUserInfo } from '@/stores/stateUserInfo'
import { attendanceState } from '@/stores/attendaceState'
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
//etc..
import { AttendanceSteps } from '@/constants/menu'
import { AttendanceStatus } from '@/types/attendance'
import { getTodayString } from '@/utils/dateUtils'

interface AttendanceProps {}

const AttendancePage = ({}: AttendanceProps) => {
  const today = dayjs()
  const [sunday, setSunday] = useState(getTodayString(today))
  const userInfo = useRecoilValue(stateUserInfo)
  const attendanceManagement = useRecoilValue(attendanceState)
  const [stepIdx, setStepIdx] = useState<number>(0)
  const categories = [
    {
      id: 0,
      name: 'Attendance',
      component: <AttendanceForm attendedAt={sunday} setStepIdx={setStepIdx} />,
    },
    {
      id: 1,
      name: 'Preview',
      component: (
        <AttendancePreview
          sunday={sunday}
          submitDate={getTodayString(today)}
          setStepIdx={setStepIdx}
        />
      ),
    },
    {
      id: 2,
      name: 'Preview',
      component: <AttendanceComplete sunday={sunday} />,
    },
  ]

  useEffect(() => {
    if (today.get('day') === 0) {
      setSunday(getTodayString(today))
    } else {
      setSunday(getTodayString(today.subtract(today.get('day'), 'day')))
    }
  }, [today])

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
          description={`셀원 출석체크는 매주 화요일 전까지 제출해주세요!\n화요일 이후 수정 및 제출이 불가합니다`}
        />
        <Spacer size={'h-6 lg:h-8'} />
        {attendanceManagement.status === AttendanceStatus.COMPLETED ? (
          <SuccessAlerts
            description="이번주 출석체크 제출을 완료하였습니다."
            linkText="수정제출"
          />
        ) : (
          <>
            {attendanceManagement.status === AttendanceStatus.BEFORE && (
              <ListAlerts title={'이번주 예배출석을 확인하지 않았습니다'}>
                <li>{sunday} 출석체크를 제출해주세요</li>
              </ListAlerts>
            )}
            {attendanceManagement.status === AttendanceStatus.TEMPORARY && (
              <DescriptionAlerts
                description="작성 중인 출석체크가 존재합니다."
                accentText="웹페이지를 닫을 경우 정보가 소실되어 처음부터 작성해야 합니다"
              />
            )}
            <Spacer size={'h-6 lg:h-12'} />
            <Steps
              steps={AttendanceSteps}
              stepIdx={stepIdx}
              setSelect={setStepIdx}
            />
            <Spacer size={'h-6 lg:h-8'} />
            {categories[stepIdx].component}
          </>
        )}
      </Container>
    </Layout>
  )
}

export default AttendancePage
