import React from 'react'
// components
import Layout from '@components/Atoms/Layout/Layout'
import Container from '@/components/Atoms/Container/Container'
import SettingListItem from '@/components/Organisms/Settings/SettingListItem/SettingListItem'
import Spacer from '@/components/Atoms/Spacer'

interface SettingProps {}

const Setting = ({}: SettingProps) => {
  return (
    <Layout>
      <Container>
        <h6 className="text-xl">Settings</h6>
        <Spacer size="h-8" />
        <SettingListItem />
        <section
          className="mt-6 rounded-xl bg-blue-50 p-4"
          aria-labelledby="pwa-install-title"
        >
          <h2 id="pwa-install-title" className="font-bold text-gray-900">
            홈 화면에 인터치 리더스 추가
          </h2>
          <p className="mt-2 text-sm leading-6 text-gray-700">
            iPhone·iPad에서는 Safari의 공유 메뉴에서 ‘홈 화면에 추가’를
            선택하세요. Android에서는 Chrome 메뉴의 ‘앱 설치’ 또는 ‘홈 화면에
            추가’를 선택하세요.
          </p>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            출석체크와 주문 등 서비스 이용에는 인터넷 연결이 필요합니다.
          </p>
        </section>
      </Container>
    </Layout>
  )
}

export default Setting
