import React from 'react'
//types
import { RoleType } from '@/graphql/generated'
import { DallantCellCombinedMember } from '@/types/dallant'
//component
import CellDallantListItem from '../CellDallantListItem'
import EmptyStateSimple from '@/components/Atoms/EmptyStates/EmptyStateSimple'

interface CellDallantListProps {
  isLoading: boolean
  cellMember: DallantCellCombinedMember[] | null
}

const CellDallantList = ({ isLoading, cellMember }: CellDallantListProps) => {
  return (
    <>
      {isLoading ? (
        <>
          <div className="animate-pulse space-y-6 py-6 px-10 rounded-xl bg-[#F7F7F7]">
            <div className="h-[6px] w-1/4 bg-slate-200 rounded"></div>
            <div className="h-[10px] w-1/2 bg-slate-200 rounded justify-items-end"></div>
          </div>
          <div className="animate-pulse space-y-6 py-6 px-10 rounded-xl bg-[#F7F7F7] mt-2">
            <div className="h-[6px] w-1/4 bg-slate-200 rounded"></div>
            <div className="h-[10px] w-1/2 bg-slate-200 rounded"></div>
          </div>
        </>
      ) : (
        <div>
          {cellMember ? (
            <div className="grid grid-cols-1 gap-y-3 lg:grid-cols-4 lg:gap-4">
              {cellMember
                .filter((member) => member.roles.includes(RoleType.CellLeader))
                .map((member) => (
                  <CellDallantListItem key={member.id} member={member} />
                ))}
              {cellMember
                .filter((member) => !member.roles.includes(RoleType.CellLeader))
                .sort((a, b) =>
                  a.name < b.name ? -1 : a.name > b.name ? 1 : 0
                )
                .map((member) => (
                  <CellDallantListItem key={member.id} member={member} />
                ))}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center py-2 rounded-xl bg-[#F7F7F7]">
              <EmptyStateSimple />
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default CellDallantList
