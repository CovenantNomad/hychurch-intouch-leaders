import Link from 'next/link'
import React from 'react'

interface LinkButtonProps {
  href: string
  label: string
}

const LinkButton = ({ href, label }: LinkButtonProps) => {
  return (
    <Link href={href}>
      <button className="rounded-lg px-4 py-2 bg-black">
        <span className="text-white font-light text-base">{label}</span>
      </button>
    </Link>
  )
}

export default LinkButton
