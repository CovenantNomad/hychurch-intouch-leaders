import Image from 'next/image'
import React, { useState } from 'react'
import Avatar, { AvatarSize } from '../Avatar'
import HamburgerMenu from '../HamburgerMenu/HamburgerMenu'

interface NavbarProps {}

const Navbar = ({}: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="h-16 flex justify-between items-center px-4 md:hidden">
      <HamburgerMenu isOpen={isOpen} setIsOpen={setIsOpen} />
      <Image
        src={'/images/Intouch_logo.png'}
        height={40}
        width={40}
        alt="인터치교회 로고"
      />
    </div>
  )
}

export default Navbar
