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
      </Container>
    </Layout>
  )
}

export default Setting
