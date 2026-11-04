import React, { useCallback, useState } from 'react'
import SplashScreen from '../SplashScreen/SplashScreen'

interface RootAppProps {
  children: React.ReactNode
}

const RootApp = ({ children }: RootAppProps) => {
  const [initialized, setInitialized] = useState(false)

  const onFinished = useCallback(() => setInitialized(true), [])

  if (!initialized) {
    return <SplashScreen onFinished={onFinished} />
  }
  return <div>{children}</div>
}

export default RootApp
