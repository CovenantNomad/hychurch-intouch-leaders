import React from 'react'

interface ButtonProps {
  onClick: () => void
  outline: boolean
  children: React.ReactNode
}

const Button = ({ onClick, outline, children }: ButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium shadow-sm
        ${
          outline
            ? 'border-gray-300 bg-white text-gray-700  hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100'
            : 'border-transparent bg-blue-600 text-white  hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100'
        }  
      `}
    >
      {children}
    </button>
  )
}

export default Button
