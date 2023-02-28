import React from 'react'

interface SummaryButtonProps {
  label: string
  onClick: () => void
}

const SummaryButton = ({ label, onClick }: SummaryButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-md border border-transparent bg-[#B0D1D4] py-3 px-4 text-base font-poppins font-medium text-white shadow-sm focus:outline-none"
    >
      {label}
    </button>
  )
}

export default SummaryButton
