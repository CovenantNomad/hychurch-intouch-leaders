import React from 'react'

interface SkeletonProps extends React.HTMLProps<HTMLDivElement> {
  // 기존에 정의된 SkeletonProps 외의 다른 props를 추가할 수 있습니다.
  // 필요에 따라 다른 prop들을 추가할 수 있습니다.
}

const Skeleton: React.FC<SkeletonProps> = ({ className, ...rest }) => {
  // 전달된 className 및 다른 props들을 사용하여 div 요소 생성
  return <div className={`animate-pulse ${className}`} {...rest} />
}

export default Skeleton
