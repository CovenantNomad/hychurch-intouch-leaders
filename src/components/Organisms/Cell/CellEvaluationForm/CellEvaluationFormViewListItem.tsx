import React, { useState } from 'react'
import Skeleton from '@/components/Atoms/Skeleton'
import { Gender } from '@/graphql/generated'
import CellEvaluationFormViewerModal from './CellEvaluationFormViewerModal'
import { useQuery } from '@tanstack/react-query'
import { getIndividaulEvaluationSubmission } from '@/firebase/evaluation/evaluation'

type CellEvaluationFormViewListItemProps = {
  userId: string
  userName: string
  gender?: Gender | null | undefined
  seasonName: string | undefined
}

const CellEvaluationFormViewListItem = ({
  userId,
  userName,
  gender,
  seasonName,
}: CellEvaluationFormViewListItemProps) => {
  const [open, setOpen] = useState(false)

  const { isLoading, isFetching, data } = useQuery({
    queryKey: ['getIndividaulEvaluationSubmission', seasonName, userId],
    queryFn: () =>
      getIndividaulEvaluationSubmission({
        seasonName: String(seasonName),
        userId: String(userId),
      }),
    staleTime: 10 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
    enabled: !!seasonName && !!userId,
  })

  return (
    <>
      <div className="flex justify-between items-center border rounded-md py-3 px-3">
        <div className="space-x-2">
          <span>{userName}</span>
          <span className="text-sm">
            {gender === Gender.Man ? '형제' : '자매'}
          </span>
        </div>
        <div className="flex items-center gap-x-3">
          {isLoading || isFetching ? (
            <Skeleton className="w-12 h-6 bg-gray-100 rounded-full" />
          ) : (
            <>
              {data ? (
                <button onClick={() => setOpen(true)}>
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                    열람하기
                  </span>
                </button>
              ) : (
                <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                  데이터없음
                </span>
              )}
            </>
          )}
        </div>
      </div>
      <CellEvaluationFormViewerModal
        open={open}
        setOpen={setOpen}
        data={data}
      />
    </>
  )
}

export default CellEvaluationFormViewListItem
