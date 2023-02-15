import React from 'react'

interface SectionTitleProps {
  title: string
}

const SectionTitle = ({ title }: SectionTitleProps) => {
  return <h4 className="text-xl font-semibold">{title}</h4>
}

export default SectionTitle
