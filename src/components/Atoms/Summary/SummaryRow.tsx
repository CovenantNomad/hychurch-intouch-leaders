import React from 'react'

interface SummaryRowProps {
  title: string
  definition: string
}

const SummaryRow = ({ title, definition }: SummaryRowProps) => {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-sm text-gray-600">{title}</dt>
      <dd className="text-sm font-medium text-gray-900">{definition}</dd>
    </div>
  )
}

export default SummaryRow
