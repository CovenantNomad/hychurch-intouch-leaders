import React from 'react'

interface TitleTextProps {
  children: React.ReactNode
}

const ListTitleText = ({ children }: TitleTextProps) => {
  return <h5 className="text-lg font-bold">{children}</h5>
}

export default ListTitleText
