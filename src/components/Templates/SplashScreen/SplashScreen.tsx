import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/hooks/useAuth'
import { INTOUCH_LEADERS_ACCESS_TOKEN } from '@/constants/constants'
import Layout from '@components/Atoms/Layout/Layout'
import Container from '@components/Atoms/Container/Container'
import graphlqlRequestClient from '@/client/graphqlRequestClient'
import { MeDocument } from '@/graphql/generated'

interface SplashScreenProps {
  onFinished: () => void
}

const SplashScreen = ({ onFinished }: SplashScreenProps) => {
  const router = useRouter()
  const { setUserInfo } = useAuth()

  const init = async () => {
    try {
      const token = localStorage.getItem(INTOUCH_LEADERS_ACCESS_TOKEN)
      if (token) {
        console.log('refresh')
        const userInfo = JSON.parse(token)
        graphlqlRequestClient.setHeader('authorization', userInfo.accessToken)
        const result = await graphlqlRequestClient.request(MeDocument)
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
          <p className="text-black font-bold text-sm">
            SHALOM IN<strong className="text-xl">✝︎</strong>OUCH
          </p>
        </div>
      </Container>
    </Layout>
  )
}

export default SplashScreen
