import '../styles/globals.css'
import { useEffect } from 'react'
import type { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from 'next-themes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GraphQLClient } from 'graphql-request'
import { useRouter } from 'next/router'
import { INTOUCH_LEADERS_ACCESS_TOKEN } from 'src/constants/constants'
import graphlqlRequestClient from 'src/client/graphqlRequestClient'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem(INTOUCH_LEADERS_ACCESS_TOKEN)
    if (token) {
      console.log('refresh')
      const userInfo = JSON.parse(token)
      graphlqlRequestClient.setHeader('authorization', userInfo.accessToken)
      if (router.asPath === '/') {
        router.push('/home')
      }
    } else {
      router.push('/')
    }
  }, [])

  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider enableSystem={true}>
          <Component {...pageProps} />
          <Toaster
            toastOptions={{
              success: {
                style: {
                  background: '#fff',
                  color: '#222',
                },
              },
              error: {
                style: {
                  background: '#fff',
                  color: '#222',
                },
              },
            }}
          />
        </ThemeProvider>
      </QueryClientProvider>
    </RecoilRoot>
  )
}
