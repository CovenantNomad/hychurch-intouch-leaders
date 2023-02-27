import React from 'react'

interface SummaryHeaderProps {
  header: string
}

const SummaryHeader = ({ header }: SummaryHeaderProps) => {
  return (
    <h2
      id="summary-heading"
      className="text-lg font-poppins font-medium text-gray-900"
    >
      {header}
    </h2>
  )
}

export default SummaryHeader
