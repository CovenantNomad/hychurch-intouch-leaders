import React from 'react'

interface SidebarProps {}

const Sidebar = ({}: SidebarProps) => {
  return (
    <div
      className={`hidden fixed left-0 top-0 bottom-0 flex-col flex-nowrap overflow-hidden z-[2000] px-6 transition-all duration-300 bg-black md:flex md:shadow-xl md:w-60 md:justify-between`}
    >
      Sidebar
    </div>
  )
}

export default Sidebar
