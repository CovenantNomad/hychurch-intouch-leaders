import Container from '@/components/Atoms/Container/Container'
import Layout from '@/components/Atoms/Layout/Layout'
import React from 'react'

interface changePasswordProps {}

const changePassword = ({}: changePasswordProps) => {
  return (
    <Layout>
      <Container>
        <h6 className="text-xl">Change Password</h6>
      </Container>
    </Layout>
  )
}

export default changePassword
