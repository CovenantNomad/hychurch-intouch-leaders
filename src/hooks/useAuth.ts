import graphlqlRequestClient from '@/client/graphqlRequestClient'
import { INTOUCH_LEADERS_ACCESS_TOKEN } from '@/constants/constants'
import { stateUserInfo } from '@/stores/stateUserInfo'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'

export const useAuth = () => {
  const [userInfo, setUserInfo] = useRecoilState(stateUserInfo)
  const router = useRouter()

  const onLogOutHandler = () => {
    localStorage.removeItem(INTOUCH_LEADERS_ACCESS_TOKEN)
    graphlqlRequestClient.setHeader('authorization', '')
    setUserInfo(null)
    router.push('/')
  }

  return {
    userInfo,
    setUserInfo,
    onLogOutHandler,
  }
}
