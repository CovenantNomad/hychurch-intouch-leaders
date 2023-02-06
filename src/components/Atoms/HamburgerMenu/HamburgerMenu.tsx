import React, { Dispatch, SetStateAction, useState } from 'react'

interface HamburgerMenuProps {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

const HamburgerMenu = ({ isOpen, setIsOpen }: HamburgerMenuProps) => {
  return (
    <div
      className={`${isOpen && 'delay-75 rotate-45'}`}
      onClick={() => setIsOpen(!isOpen)}
    >
      <span
        className={`block w-6 h-[1px] rounded-full bg-black mb-[6px] transition-all ${
          isOpen && 'delay-[400] translate-y-[7px]'
        }`}
      ></span>
      <span
        className={`block w-6 h-[1px] rounded-full bg-black mb-[6px] ${
          isOpen && 'w-0'
        }`}
      ></span>
      <span
        className={`block w-6 h-[1px] rounded-full bg-black ${
          isOpen && 'delay-[400] rotate-90 -translate-y-[7px]'
        }`}
      ></span>
    </div>
  )
}

export default HamburgerMenu
