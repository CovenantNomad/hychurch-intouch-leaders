import '../styles/globals.css'
import React from 'react'
import type { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import RootApp from '@components/Templates/RootApp/RootApp'
import { ThemeProvider } from 'next-themes'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <RootApp>
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
          </RootApp>
        </QueryClientProvider>
      </RecoilRoot>
    </>
  )
}
