import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/hooks/useAuth'
import { INTOUCH_LEADERS_ACCESS_TOKEN } from '@/constants/constants'
import graphlqlRequestClient from '@/client/graphqlRequestClient'
import { parseStoredAccessToken } from '@/utils/authSession'
import { MeDocument } from '@/graphql/generated'

interface SplashScreenProps {
  onFinished: () => void
}

const SplashScreen = ({ onFinished }: SplashScreenProps) => {
  const router = useRouter()
  const { setUserInfo, clearSession } = useAuth()

  useEffect(() => {
    if (!router.isReady) return
    let active = true

    const init = async () => {
      try {
        const token = parseStoredAccessToken(
          localStorage.getItem(INTOUCH_LEADERS_ACCESS_TOKEN)
        )
        if (!token) throw new Error('로그인 정보가 없습니다')
        graphlqlRequestClient.setHeader('authorization', token)
        const result = await graphlqlRequestClient.request(MeDocument)
        if (!active) return
        if (!result?.me) throw new Error('사용자 정보를 확인할 수 없습니다')
        setUserInfo({
          id: result.me.id,
          name: result.me.name,
          cell: result.me.cell,
          roles: result.me.roles,
        })
        if (router.asPath === '/') await router.replace('/home')
      } catch {
        if (!active) return
        clearSession()
        try {
          if (router.asPath !== '/') await router.replace('/')
        } catch {
          window.location.replace('/')
          return
        }
      } finally {
        if (active) onFinished()
      }
    }

    void init()
    return () => {
      active = false
    }
  }, [router, router.isReady, setUserInfo, clearSession, onFinished])

  return (
    <main
      className="flex min-h-screen items-center justify-center"
      role="status"
      aria-label="로그인 확인 중"
    >
      <p className="text-black font-bold text-sm">
        SHALOM IN<strong className="text-xl">✝︎</strong>OUCH
      </p>
    </main>
  )
}

export default SplashScreen
