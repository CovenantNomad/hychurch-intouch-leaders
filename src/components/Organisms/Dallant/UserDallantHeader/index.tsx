import React from 'react'
import toast from 'react-hot-toast'
import Container from '@/components/Atoms/Container/Container'
import { ChevronLeftIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
import useUserDallant from '@/hooks/useUserDallant'
import EmptyStateSimple from '@/components/Atoms/EmptyStates/EmptyStateSimple'

interface UserDallantHeaderProps {
  id: string
  userName: string
  totalAmount: number
  isLeader: boolean
  goBack: () => void
}

const UserDallantHeader = ({
  id,
  userName,
  totalAmount,
  isLeader,
  goBack,
}: UserDallantHeaderProps) => {
  const { isLoading, userInfo } = useUserDallant(id)

  if (userName && totalAmount && isLeader) {
    return (
      <div
        className={`${
          isLeader ? 'bg-[#4EBCB3]' : 'bg-[#9FB2DA]'
        } pt-4 pb-4 lg:pt-8`}
      >
        <Container>
          <div className="flex justify-between items-center">
            <ChevronLeftIcon
              onClick={goBack}
              className="h-7 w-7 cursor-pointer"
            />
            <p className="text-lg font-sans">달란트통장</p>
            <Cog6ToothIcon
              onClick={() => toast.success('아직은 데코예요 ^^')}
              className="h-7 w-7 cursor-pointer"
            />
          </div>
          <div className="flex flex-col space-y-2 justify-center items-center py-20">
            <p className="text-gray-500 font-sans">
              {userName}&apos;s 달란트통장
            </p>
            <p className="text-3xl font-black font-sans">
              {Number(totalAmount).toLocaleString('kr-KR')}{' '}
              <span className="text-2xl font-semibold">달란트</span>
            </p>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div>
      {isLoading ? (
        <div className={`bg-[#9FB2DA] py-8`}>
          <Container>
            <div className="flex justify-between items-center">
              <ChevronLeftIcon
                onClick={goBack}
                className="h-7 w-7 cursor-pointer"
              />
              <p className="text-lg font-sans">달란트통장</p>
              <Cog6ToothIcon
                onClick={() => toast.success('아직은 데코예요 ^^')}
                className="h-7 w-7 cursor-pointer"
              />
            </div>
            <div className="animate-pulse flex flex-col items-center space-y-6 px-10 pt-14 pb-8">
              <div className="h-2 w-1/4 bg-slate-200 rounded"></div>
              <div className="h-2 w-1/2 bg-slate-200 rounded"></div>
            </div>
          </Container>
        </div>
      ) : (
        <div>
          {userInfo ? (
            <div
              className={`${
                isLeader ? 'bg-[#4EBCB3]' : 'bg-[#9FB2DA]'
              } pt-4 pb-4`}
            >
              <Container>
                <div className="flex justify-between items-center">
                  <ChevronLeftIcon
                    onClick={goBack}
                    className="h-7 w-7 cursor-pointer"
                  />
                  <p className="text-lg font-sans">달란트통장</p>
                  <Cog6ToothIcon
                    onClick={() => toast.success('아직은 데코예요 ^^')}
                    className="h-7 w-7 cursor-pointer"
                  />
                </div>
                <div className="flex flex-col space-y-2 justify-center items-center py-20">
                  <p className="text-gray-500 font-sans">
                    {userInfo.userName}&apos;s 달란트통장
                  </p>
                  <p className="text-3xl font-black font-sans">
                    {userInfo.totalAmount.toLocaleString('kr-KR')}{' '}
                    <span className="text-2xl font-semibold">달란트</span>
                  </p>
                </div>
              </Container>
            </div>
          ) : (
            <div className={`bg-[#9FB2DA] py-8`}>
              <Container>
                <div className="flex justify-between items-center">
                  <ChevronLeftIcon
                    onClick={goBack}
                    className="h-7 w-7 cursor-pointer"
                  />
                  <p className="text-lg font-sans">달란트통장</p>
                  <Cog6ToothIcon
                    onClick={() => toast.success('아직은 데코예요 ^^')}
                    className="h-7 w-7 cursor-pointer"
                  />
                </div>
                <div className="pt-8">
                  <EmptyStateSimple />
                </div>
              </Container>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default UserDallantHeader
