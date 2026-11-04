import Head from 'next/head'
import { useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { MeDocument, useLoginMutation } from '@/graphql/generated'
import graphlqlRequestClient from '@/client/graphqlRequestClient'
import { LoginForm } from '@/types/auth'
import { useAuth } from '@/hooks/useAuth'
// components
import Spinner from '@components/Atoms/Spinner'
import { INTOUCH_LEADERS_ACCESS_TOKEN } from '@/constants/constants'

export default function Login() {
  const router = useRouter()
  const { setUserInfo, clearSession } = useAuth()
  const loginPending = useRef(false)
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  const { mutate, isLoading } = useLoginMutation(graphlqlRequestClient, {
    onSuccess: async (data) => {
      try {
        const accessToken = data.login.accessToken
        if (!accessToken?.trim()) throw new Error('로그인 토큰이 없습니다')
        graphlqlRequestClient.setHeader('authorization', accessToken)
        const result = await graphlqlRequestClient.request(MeDocument)
        if (!result?.me) throw new Error('사용자 정보를 확인할 수 없습니다')
        localStorage.setItem(
          INTOUCH_LEADERS_ACCESS_TOKEN,
          JSON.stringify({ accessToken })
        )
        setUserInfo({
          id: result.me.id,
          name: result.me.name,
          cell: result.me.cell,
          roles: result.me.roles,
        })
        await router.replace('/home')
      } catch {
        clearSession()
        toast.error('사용자 정보를 확인하지 못했습니다. 다시 로그인해주세요.')
      } finally {
        loginPending.current = false
        setIsAuthenticating(false)
      }
    },
    onError() {
      clearSession()
      loginPending.current = false
      setIsAuthenticating(false)
      toast.error('로그인에 실패했습니다.')
    },
  })

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginForm>()

  const onSubmitHandler = ({ phone, password }: LoginForm) => {
    if (loginPending.current) return
    loginPending.current = true
    setIsAuthenticating(true)
    clearSession()
    mutate({
      input: {
        phone,
        password,
      },
    })
  }

  return (
    <>
      <Head>
        <title>로그인 | INTOUCH CHURCH</title>
      </Head>
      <main className="w-full h-screen flex flex-col items-center justify-center">
        <h3 className="text-4xl font-poppins font-light">Heirs</h3>
        <h6 className="text-sm italic mb-8">by intouch</h6>

        <form
          onSubmit={handleSubmit(onSubmitHandler)}
          className="space-y-4 w-80"
        >
          <div className="flex flex-col justify-center">
            <label htmlFor="phone" className="sr-only">
              휴대폰번호
            </label>
            <input
              id="phone"
              type="text"
              placeholder="Phone Number"
              {...register('phone', {
                required: '휴대폰번호를 입력해주세요',
                setValueAs: (v) => v.replace(/[-.,_+]|\s/g, ''),
                minLength: {
                  value: 9,
                  message: '최소 9자리 이상 입력해주세요',
                },
                maxLength: {
                  value: 11,
                  message: '휴대폰번호는 최대 11자리입니다',
                },
              })}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 outline-none appearance-none focus:border-black sm:text-sm"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <label htmlFor="password" className="sr-only">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              {...register('password', {
                required: '비밀번호를 입력해주세요',
              })}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 outline-none appearance-none focus:border-black sm:text-sm"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading || isAuthenticating}
              className="w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white hover:bg-blue-600 bg-blue-500/90"
            >
              {isLoading || isAuthenticating ? <Spinner /> : 'LOGIN'}
            </button>
          </div>
        </form>
      </main>
    </>
  )
}
