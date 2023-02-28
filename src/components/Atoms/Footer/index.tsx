import React from 'react'

interface FooterProps {}

const Footer = ({}: FooterProps) => {
  return (
    <div className="flex justify-center border-t border-t-[#eaeaea] py-5 px-4 mt-8 mb-20 lg:px-8">
      <p className="text-black font-bold text-sm">
        SHALOM IN<strong className="text-xl">✝︎</strong>OUCH
      </p>
    </div>
  )
}

export default Footer
