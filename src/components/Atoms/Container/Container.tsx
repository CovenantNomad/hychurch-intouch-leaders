import React from 'react'

interface ContainerProps {
  children: React.ReactNode
}

const Container = ({ children }: ContainerProps) => {
  return <section className="px-4 md:px-6 lg:px-8">{children}</section>
}

export default Container
