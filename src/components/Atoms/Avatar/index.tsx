import React from 'react'

export enum AvatarSize {
  xs = 'h-8 w-8',
  sm = 'h-10 w-10',
  md = 'h-12 w-12',
  lg = 'h-16 w-16',
}

interface AvatarProps {
  name: string
  size: AvatarSize
  inline?: boolean
  center?: boolean
  rounded?: boolean
}

const Avatar = ({ name, size, inline, center, rounded }: AvatarProps) => {
  const nameCheck = /[a-zA-Z]/
  return (
    <div
      className={`
        ${size} 
        ${inline ? 'inline-flex' : 'flex'} 
        items-center justify-center 
        ${center ? 'mx-auto' : 'mx-0'} 
        ${rounded ? 'rounded-full' : 'rounded-md'} 
        bg-gray-500
      `}
    >
      <span className="text-xl font-medium leading-none text-white">
        {name.substring(
          nameCheck.test(name) ? name.length - 3 : name.length - 2,
          nameCheck.test(name) ? name.length - 1 : name.length
        )}
      </span>
    </div>
  )
}

export default Avatar
