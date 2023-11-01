import React, { useEffect } from 'react'
import Image from 'next/image'
//components
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

interface CellDayMenuHeaderProps {
  menuImageUrl: string
  goBack: () => void
}

const CellDayMenuHeader = ({
  menuImageUrl,
  goBack,
}: CellDayMenuHeaderProps) => {
  return (
    <div
      className={`relative w-full ${
        menuImageUrl ? 'h-[300px] bg-gray-50' : 'h-[60px]'
      } `}
    >
      <div className="relative h-[300px]">
        {menuImageUrl && (
          <Image src={menuImageUrl} alt="메뉴사진" fill priority />
        )}
      </div>
      <div className="absolute top-4 left-4">
        <button onClick={goBack}>
          <ArrowLeftIcon
            className={`h-6 w-6 ${menuImageUrl ? 'text-white' : 'text-black'}`}
          />
        </button>
      </div>
    </div>
  )
}

export default CellDayMenuHeader
