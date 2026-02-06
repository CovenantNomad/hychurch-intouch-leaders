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
        isSecondaryButton ? 'bg-red-500' : 'bg-teal-500'
      } py-3 px-4 text-sm font-poppins font-medium text-white shadow-sm focus:outline-none disabled:bg-stone-300`}
    >
      {label}
    </button>
  )
}

export default SummaryButton
