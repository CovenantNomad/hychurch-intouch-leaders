import React from 'react'
import EmptyStateSimple from '@/components/Atoms/EmptyStates/EmptyStateSimple'
import Spacer from '@/components/Atoms/Spacer'
import Spinner from '@/components/Atoms/Spinner'
import SectionTitle from '@/components/Atoms/Typography/SectionTitle'
import CellLeaderListItem from '@/components/Organisms/Cell/CellLeaderListItem'
import CellMemberListItem from '@/components/Organisms/Cell/CellMemberListItem'
import { RoleType } from '@/graphql/generated'
import { useAuth } from '@/hooks/useAuth'
import { useFindCellMembers } from '@/hooks/useFindCellMembers'

interface CellMemberListScreenProps {}

const CellMemberListScreen = ({}: CellMemberListScreenProps) => {
  const { userInfo } = useAuth()
  const { isLoading, isFetching, data } = useFindCellMembers()

  return (
    <>
      <SectionTitle title="셀리더 정보" />
      <Spacer size={'h-3'} />
      <div className="grid grid-cols-1 gap-y-3 lg:grid-cols-2 lg:gap-x-6 xl:grid-cols-3 xl:gap-x-8">
        {userInfo ? (
          <CellLeaderListItem userId={userInfo.id} name={userInfo.name} />
        ) : (
          <div className="py-4">셀리더 정보를 가져올 수 없습니다</div>
        )}
      </div>
      <Spacer size={'h-8'} />
      <SectionTitle title="셀원 정보" />
      <Spacer size={'h-3'} />
      {isLoading || isFetching ? (
        <div className="w-full py-20 flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          {data && data.myCellMembers ? (
            <>
              <div className="pt-2">
                <h3 className="text-base font-medium leading-7 text-gray-900">
                  셀보고서 작성 셀원
                </h3>
                <div className="grid grid-cols-1 gap-y-3 lg:grid-cols-2 lg:gap-x-6 xl:grid-cols-3 xl:gap-x-8">
                  {data.myCellMembers
                    .filter(
                      (member) => !member.roles.includes(RoleType.CellLeader)
                    )
                    .filter((member) => member.isActive)
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((member) => (
                      <CellMemberListItem
                        key={member.id}
                        userId={member.id}
                        name={member.name}
                        gender={member.gender!}
                        birthday={member.birthday || '1990-01-01'}
                        phone={member.phone}
                      />
                    ))}
                </div>
              </div>
              <Spacer size={'h-3'} />
              <div className="pt-2">
                <h3 className="text-base font-medium leading-7 text-gray-900">
                  셀보고서 미작성 셀원
                </h3>
                <div className="grid grid-cols-1 gap-y-3 lg:grid-cols-2 lg:gap-x-6 xl:grid-cols-3 xl:gap-x-8">
                  {data.myCellMembers
                    .filter(
                      (member) => !member.roles.includes(RoleType.CellLeader)
                    )
                    .filter((member) => !member.isActive)
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((member) => (
                      <CellMemberListItem
                        key={member.id}
                        userId={member.id}
                        name={member.name}
                        gender={member.gender!}
                        birthday={member.birthday || '1990-01-01'}
                        phone={member.phone}
                      />
                    ))}
                </div>
              </div>
            </>
          ) : (
            <EmptyStateSimple />
          )}
        </>
      )}
      <Spacer size={'h-[50px]'} />
    </>
  )
}

export default CellMemberListScreen
