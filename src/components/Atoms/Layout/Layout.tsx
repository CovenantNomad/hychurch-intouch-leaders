import React, { useState } from 'react'
import Footer from '../Footer'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <Navbar />
      <Sidebar />
      <main className="lg:ml-60 bg-[#fff]">
        {children}
        <Footer />
      </main>
    </div>
  )
}

export default Layout
