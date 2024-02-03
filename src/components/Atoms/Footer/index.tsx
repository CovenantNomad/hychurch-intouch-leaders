import React from 'react'

interface FooterProps {}

const Footer = ({}: FooterProps) => {
  return (
    <div className="flex justify-center pt-[10px] pb-[30px] px-4 border-t border-t-[#eaeaea] lg:ml-60 lg:px-8">
      <p className="text-black font-bold text-sm">
        SHALOM IN<strong className="text-xl">✝︎</strong>OUCH
      </p>
    </div>
  )
}

export default Footer
