import React, { useState } from 'react'
import SplashScreen from '../SplashScreen/SplashScreen'

interface RootAppProps {
  children: React.ReactNode
}

const RootApp = ({ children }: RootAppProps) => {
  const [initialized, setInitialized] = useState(false)

  if (!initialized) {
    return <SplashScreen onFinished={() => setInitialized(true)} />
  }
  return <div>{children}</div>
}

export default RootApp
