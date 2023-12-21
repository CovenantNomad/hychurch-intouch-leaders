import React from 'react'

interface SummaryButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
  isSecondaryButton?: boolean
}

const SummaryButton = ({
  label,
  disabled,
  isSecondaryButton,
  onClick,
}: SummaryButtonProps) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`w-full rounded-md border border-transparent ${
        isSecondaryButton ? 'bg-red-600' : 'bg-[#B0D1D4]'
      } py-3 px-4 text-base font-poppins font-medium text-white shadow-sm focus:outline-none disabled:bg-stone-300`}
    >
      {label}
    </button>
  )
}

export default SummaryButton
