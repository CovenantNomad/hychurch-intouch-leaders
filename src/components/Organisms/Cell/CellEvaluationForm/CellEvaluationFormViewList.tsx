import React from 'react'
import { RoleType } from '@/graphql/generated'
import { useFindCellMembers } from '@/hooks/useFindCellMembers'
import Skeleton from '@/components/Atoms/Skeleton'
import EmptyStateSimple from '@/components/Atoms/EmptyStates/EmptyStateSimple'
import CellEvaluationFormViewListItem from './CellEvaluationFormViewListItem'

type CellEvaluationFormViewListProps = {
  seasonName: string | undefined
}

const CellEvaluationFormViewList = ({
  seasonName,
}: CellEvaluationFormViewListProps) => {
  const {
    isLoading: isMemberLoading,
    isFetching: isMemberFetching,
    data: cellMembers,
  } = useFindCellMembers()

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
                  <CellEvaluationFormViewListItem
                    key={member.id}
                    userId={member.id}
                    userName={member.name}
                    gender={member.gender}
                    seasonName={seasonName}
                  />
                ))}
            </div>
          ) : (
            <EmptyStateSimple />
          )}
        </>
      )}
    </div>
  )
}

export default CellEvaluationFormViewList
