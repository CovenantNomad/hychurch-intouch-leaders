import React from 'react'
import toast from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import { getUserDallantHistory } from '@/firebase/dallant/dallant'
import Container from '@/components/Atoms/Container/Container'
import EmptyStateSimple from '@/components/Atoms/EmptyStates/EmptyStateSimple'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'

interface UserDallantHistoryProps {
  id: string
}

const UserDallantHistory = ({ id }: UserDallantHistoryProps) => {
  const { isLoading, data } = useQuery(
    ['getUserDallantHistory', id],
    () => getUserDallantHistory(id),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
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
            <div className="divide-y divide-gray-100">
              {data
                .sort((a, b) => {
                  const dateA = new Date(a.createdAt)
                  const dateB = new Date(b.createdAt)
                  return dateB.getTime() - dateA.getTime()
                })
                .map((history, index) => (
                  <div key={history.docId} className="flex items-start py-4">
                    <div className="pr-5">
                      <p className="text-base text-gray-400 font-sans">
                        {history.createdAt.split('-')[1]}.
                        {history.createdAt.split('-')[2]}
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-sans leading-6">
                        {history.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg text-blue-600 font-sans font-extrabold leading-6">
                        {history.amount.toLocaleString('kr-KR')} D
                      </p>
                      <p className="text-gray-400 font-sans">
                        {data
                          .slice(0, index + 1)
                          .reduce((sum, item) => sum + item.amount, 0)
                          .toLocaleString('kr-KR')}{' '}
                        D
                      </p>
                    </div>
                  </div>
                ))}
            </div>
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
