import EmptyStateSimple from '@/components/Atoms/EmptyStates/EmptyStateSimple'
import Skeleton from '@/components/Atoms/Skeleton'
import { RoleType } from '@/graphql/generated'
import { useFindCellMembers } from '@/hooks/useFindCellMembers'
import React, { useMemo, useState } from 'react'
import CellEvaluationFormListItem from './CellEvaluationFormListItem'
import {
  EvaluationSubmissionStatus,
  IndividualSubmissionCheckType,
} from '@/types/evalutation'
import Button from '@/components/Atoms/Buttons/Button'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createCellEvaluationFormFinalSubmission,
  getCellSubmissionStatus,
} from '@/firebase/evaluation/evaluation'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import dayjs from 'dayjs'
import CellEvaluationFormSubmissionModal from './CellEvaluationFormSubmissionModal'

type CellEvaluationFormListProps = {
  seasonName: string
}

const CellEvaluationFormList = ({
  seasonName,
}: CellEvaluationFormListProps) => {
  const queryClient = useQueryClient()
  const { userInfo } = useAuth()
  const {
    isLoading: isMemberLoading,
    isFetching: isMemberFetching,
    data: cellMembers,
  } = useFindCellMembers()

  const [open, setOpen] = useState(false)

  const [allDataStatus, setAllDataStatus] = useState({})

  const handleCheckSubmission = (
    memberId: string,
    value: IndividualSubmissionCheckType
  ) => {
    setAllDataStatus((prevState) => ({
      ...prevState,
      [memberId]: value,
    }))
  }

  const isAllSaved = Object.values(allDataStatus).every(
    (value) => value === IndividualSubmissionCheckType.SAVED
  )

  const { isLoading, isFetching, data } = useQuery({
    queryKey: ['getCellSubmissionStatus', seasonName, userInfo?.cell?.id],
    queryFn: () =>
      getCellSubmissionStatus({
        seasonName: seasonName,
        cellId: userInfo!.cell!.id,
      }),
    staleTime: 10 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
    enabled: !!seasonName && !!userInfo?.cell?.id,
  })

  const mutation = useMutation({
    mutationFn: createCellEvaluationFormFinalSubmission,
    onSuccess: () => {
      toast.success('최종제출 되었습니다')
      queryClient.invalidateQueries({
        queryKey: ['getCellSubmissionStatus', seasonName, userInfo?.cell?.id],
      })
    },
    onError: () => {
      toast.error('에러! 오류가 발생하였습니다')
    },
  })

  if (data && data.submissionStatus === EvaluationSubmissionStatus.COMPLETE) {
    const submissionDate = data.submissionDate
      ? dayjs(data.submissionDate?.seconds * 1000)
      : dayjs()

    return (
      <div className="flex flex-col items-center shadow-sm border rounded-lg py-4 px-2 ring-1 ring-gray-100">
        <p className="text-lg font-semibold">최종제출 완료</p>
        <p className="text-sm mt-2 whitespace-pre text-center">
          {`모든 정보가 제출되었습니다\n셀원정보 작성하시느라 수고하셨습니다`}
        </p>
        <span className="block text-sm mt-1">
          (제출시각: {submissionDate.format('YYYY-MM-DD HH:mm:ss')})
        </span>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-base font-medium leading-7 text-gray-900">
        셀원명단
      </h3>
      {isMemberLoading || isMemberFetching ? (
        <div className="space-y-2 mt-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-10 bg-gray-100 rounded-md" />
          ))}
        </div>
      ) : (
        <>
          {cellMembers && cellMembers.myCellMembers ? (
            <div className="grid grid-cols-1 gap-2 lg:grid-cols-3 mt-2">
              {cellMembers.myCellMembers
                .filter((item) => !item.roles.includes(RoleType.CellLeader))
                .sort((a, b) =>
                  a.name < b.name ? -1 : a.name > b.name ? 1 : 0
                )
                .map((member) => (
                  <CellEvaluationFormListItem
                    key={member.id}
                    seasonName={seasonName}
                    member={member}
                    onHandleCheckSubmission={handleCheckSubmission}
                  />
                ))}
            </div>
          ) : (
            <EmptyStateSimple />
          )}
        </>
      )}

      <div className="mt-12">
        {isLoading || isFetching ? (
          <Skeleton className="h-12 bg-gray-300 " />
        ) : (
          <button
            disabled={!isAllSaved}
            onClick={() => setOpen(true)}
            className="w-full py-3 bg-blue-600 text-white cursor-pointer disabled:bg-gray-600"
          >
            최종제출
          </button>
        )}
      </div>
      <CellEvaluationFormSubmissionModal
        open={open}
        setOpen={setOpen}
        actionHandler={() =>
          mutation.mutateAsync({
            cellId: userInfo!.cell!.id,
          })
        }
      />
    </div>
  )
}

export default CellEvaluationFormList
