import React from 'react'
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
      <main className="pb-20 bg-white lg:ml-60">{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
