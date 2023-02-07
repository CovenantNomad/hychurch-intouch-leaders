import React from 'react'

interface SidebarProps {}

const Sidebar = ({}: SidebarProps) => {
  return (
    <div
      className={`hidden fixed left-0 top-0 bottom-0 flex-col flex-nowrap overflow-hidden z-[2000] px-6 transition-all duration-300 bg-black lg:flex lg:shadow-xl lg:w-60 lg:justify-between`}
    >
      Sidebar
    </div>
  )
}

export default Sidebar
