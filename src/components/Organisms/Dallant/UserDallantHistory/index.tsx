import React from 'react'
import toast from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import { getUserDallantHistory } from '@/firebase/dallant/dallant'
import Container from '@/components/Atoms/Container/Container'
import EmptyStateSimple from '@/components/Atoms/EmptyStates/EmptyStateSimple'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { convertSecondToDate } from '@/utils/dateUtils'

interface UserDallantHistoryProps {
  id: string
}

const UserDallantHistory = ({ id }: UserDallantHistoryProps) => {
  const { isLoading, data } = useQuery(
    ['getUserDallantHistory', id],
    () => getUserDallantHistory(id),
    {
      enabled: !!id,
      staleTime: 15 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
    }
  )

  return (
    <Container>
      <div className="flex justify-between items-center py-4 border-b border-b-gray-100">
        <MagnifyingGlassIcon
          className="w-6 h-6 text-gray-400 cursor-pointer"
          onClick={() => toast.success('개발 중')}
        />
        <button onClick={() => toast.success('개발 중')}>
          <p className="text-sm text-gray-400">최신순</p>
        </button>
      </div>
      {isLoading ? (
        <>
          <div className="animate-pulse flex justify-between items-center py-10 border-b border-b-gray-100">
            <div className="h-2 w-1/6 bg-slate-200 rounded"></div>
            <div className="h-2 w-1/3 bg-slate-200 rounded"></div>
            <div className="h-2 w-1/5 bg-slate-200 rounded"></div>
          </div>
          <div className="animate-pulse flex justify-between items-center py-10 border-b border-b-gray-100">
            <div className="h-2 w-1/6 bg-slate-200 rounded"></div>
            <div className="h-2 w-1/3 bg-slate-200 rounded"></div>
            <div className="h-2 w-1/5 bg-slate-200 rounded"></div>
          </div>
        </>
      ) : (
        <div>
          {data ? (
            <ul role="list" className="pt-4 divide-y divide-[#dcdee0]">
              {data.map((transaction, index) => (
                <li key={index} className="flex">
                  <div className="min-w-[52px] pt-5 text-sm">
                    {transaction.createdAt.split('-')[1]}.
                    {transaction.createdAt.split('-')[2]}
                  </div>
                  <div className="w-full pt-5 pb-5">
                    <div className="flex justify-between item-center">
                      <div>
                        <span className="text-base font-normal">
                          {transaction.description}
                        </span>
                      </div>
                      <div>
                        <strong className="font-sans text-blue-500">
                          {transaction.totalAmount} D
                        </strong>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs font-sans text-sky-700">
                          {convertSecondToDate(
                            transaction.createdTimestamp.seconds
                          ).format('YYYY.MM.DD HH:mm:ss')}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-sans text-gray-500">
                          {transaction.amount} D 적립
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-4">
              <EmptyStateSimple />
            </div>
          )}
        </div>
      )}
    </Container>
  )
}

export default UserDallantHistory
