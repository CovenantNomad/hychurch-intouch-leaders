import Skeleton from '@/components/Atoms/Skeleton'
import {
  getEvalutationSettings,
  getIndividaulSubmissionStatus,
} from '@/firebase/evaluation/evaluation'
import { IndividualSubmissionCheckType } from '@/types/evalutation'
import { Member } from '@/types/member'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import React, { useEffect } from 'react'

type CellEvaluationFormListItemProps = {
  seasonName: string
  member: Member
  onHandleCheckSubmission: (
    memberId: string,
    value: IndividualSubmissionCheckType
  ) => void
}

const CellEvaluationFormListItem = ({
  seasonName,
  member,
  onHandleCheckSubmission,
}: CellEvaluationFormListItemProps) => {
  const { isLoading, isFetching, data } = useQuery({
    queryKey: ['getIndividaulSubmissionStatus', seasonName, member.id],
    queryFn: () =>
      getIndividaulSubmissionStatus({
        seasonName: seasonName,
        userId: member.id,
      }),
    staleTime: 60 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
    enabled: !!seasonName && !!member.id,
  })

  useEffect(() => {
    if (data) {
      onHandleCheckSubmission(member.id, data)
    }
  }, [data, member.id])

  return (
    <Link
      href={{
        pathname: `/cell/evaluations/${seasonName}/${member.id}`,
        query: {
          userName: member.name,
          cellId: member.cell?.id,
          cellName: member.cell?.name,
        },
      }}
      as={`/cell/evaluations/${seasonName}/${member.id}`}
    >
      <div className="flex justify-between items-center border rounded-md py-3 px-3">
        <span>{member.name}</span>
        <div className="flex items-center gap-x-3">
          {isLoading || isFetching ? (
            <Skeleton className="w-12 h-6 bg-gray-100 rounded-full" />
          ) : (
            <>
              {data ? (
                <>
                  {data === IndividualSubmissionCheckType.SAVED ? (
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      저장됨
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                      미작성
                    </span>
                  )}
                </>
              ) : (
                <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                  데이터없음
                </span>
              )}
            </>
          )}
          <ChevronRightIcon className="h-5 w-5" />
        </div>
      </div>
    </Link>
  )
}

export default CellEvaluationFormListItem
