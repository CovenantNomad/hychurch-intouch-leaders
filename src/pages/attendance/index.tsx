import React, { useState } from 'react'
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

import { AttendanceStatus } from '@/types/attendance'
import AttendanceStatusOverView from '@/components/Organisms/Attendance/AttendanceStatusOverView'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import WorshipAttendance from '@/components/Templates/Attendance/WorshipAttendance'
import CellMeetingAttendance from '@/components/Templates/Attendance/CellMeetingAttendance'

interface AttendanceProps {}

const AttendancePage = ({}: AttendanceProps) => {
  const userInfo = useRecoilValue(stateUserInfo)

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
          description={`출석체크는 매주 화요일까지 제출해주세요!\n출석체크가 완료되지 않으면 새가족 배정을 못합니다`}
        />
        <Spacer size={'h-6 lg:h-8'} />
        <AttendanceStatusOverView userInfo={userInfo} />
        <Spacer size={'h-6 lg:h-8'} />
        <Tabs defaultValue="worship">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="worship">예배출석</TabsTrigger>
            <TabsTrigger value="cellmeeting">셀모임출석</TabsTrigger>
          </TabsList>
          <TabsContent value="worship">
            <WorshipAttendance />
          </TabsContent>
          <TabsContent value="cellmeeting">
            <CellMeetingAttendance userInfo={userInfo} />
          </TabsContent>
        </Tabs>
      </Container>
    </Layout>
  )
}

export default AttendancePage
