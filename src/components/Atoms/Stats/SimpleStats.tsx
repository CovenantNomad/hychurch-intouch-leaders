import React from 'react'

interface SimpleStatsProps {
  title: string
  number: number
}

const SimpleStats = ({ title, number }: SimpleStatsProps) => {
  return (
    <div className="flex flex-col justify-center px-4 py-5 rounded-2xl shadow-lg bg-gray-50">
      <p className="text-sm mb-1">{title}</p>
      <div className="max-w-fit">
        <p className="text-2xl font-bold mb-1">{number}</p>
        <div className="block w-full h-[2px] bg-orange-600" />
      </div>
    </div>
  )
}

export default SimpleStats
