import React from 'react'

interface EmptyStateSimpleProps {
  warning?: boolean
}

const EmptyStateSimple = ({ warning }: EmptyStateSimpleProps) => {
  return (
    <div className="text-center py-4">
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
        />
      </svg>
      <h3 className="mt-2 text-base font-medium text-gray-900">
        데이터가 없습니다
      </h3>
      {warning && (
        <p className="mt-1 text-sm text-gray-500">관리자에게 연락해주세요</p>
      )}
    </div>
  )
}

export default EmptyStateSimple
