import React from 'react'

interface SubTitleTextProps {
  children: React.ReactNode
}

const ListSubTitleText = ({ children }: SubTitleTextProps) => {
  return <p className="text-sm text-gray-500">{children}</p>
}

export default ListSubTitleText
