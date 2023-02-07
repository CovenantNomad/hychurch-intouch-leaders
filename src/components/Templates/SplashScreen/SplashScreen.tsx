import Container from '@components/Atoms/Container/Container'
import Layout from '@components/Atoms/Layout/Layout'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useSetRecoilState } from 'recoil'
import graphlqlRequestClient from 'src/client/graphqlRequestClient'
import { INTOUCH_LEADERS_ACCESS_TOKEN } from 'src/constants/constants'
import { useMeQuery, MeDocument } from 'src/graphql/generated'
import { stateUserInfo } from 'src/stores/stateUserInfo'

interface SplashScreenProps {
  onFinished: () => void
}

const SplashScreen = ({ onFinished }: SplashScreenProps) => {
  const router = useRouter()
  const setUserInfo = useSetRecoilState(stateUserInfo)

  const getMe = async () => {
    const response = await graphlqlRequestClient.request(MeDocument)
    return response
  }

  const init = async () => {
    try {
      const token = localStorage.getItem(INTOUCH_LEADERS_ACCESS_TOKEN)
      if (token) {
        console.log('refresh')
        const userInfo = JSON.parse(token)
        graphlqlRequestClient.setHeader('authorization', userInfo.accessToken)
        const result = await getMe()
        if (result !== undefined) {
          setUserInfo({
            id: result.me.id,
            name: result.me.name,
            cell: result.me.cell,
            roles: result.me.roles,
          })
        }
        if (router.asPath === '/') {
          router.push('/home')
        }
      } else {
        setUserInfo(null)
        router.push('/')
      }
    } finally {
      onFinished()
    }
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <Layout>
      <Container>
        <div className="flex items-center justify-center h-screen">
          SplashScreen
        </div>
      </Container>
    </Layout>
  )
}

export default SplashScreen
