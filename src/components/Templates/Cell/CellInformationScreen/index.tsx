import React from 'react'
import { useRecoilValue } from 'recoil'
import { stateUserInfo } from '@/stores/stateUserInfo'
//api
import {
  FindCellQuery,
  FindCellQueryVariables,
  useFindCellQuery,
} from '@/graphql/generated'
import graphlqlRequestClient from '@/client/graphqlRequestClient'
import groupBy from '@/utils/utils'
//components
import Spacer from '@/components/Atoms/Spacer'
import Spinner from '@/components/Atoms/Spinner'
import SectionTitle from '@/components/Atoms/Typography/SectionTitle'
import EmptyStateSimple from '@/components/Atoms/EmptyStates/EmptyStateSimple'
import CellGenderStatic from '@/components/Organisms/Cell/CellGenderStatic'
import CellStatsGroup from '@/components/Organisms/Cell/CellStatsGroup'
import CellAgeStatic from '@/components/Organisms/Cell/CellAgeStatic'

const CellInfomationScreen = () => {
  const userInfo = useRecoilValue(stateUserInfo)
  const { isLoading, data } = useFindCellQuery<
    FindCellQuery,
    FindCellQueryVariables
  >(
    graphlqlRequestClient,
    {
      id: Number(userInfo?.cell?.id),
    },
    {
      enabled: Boolean(userInfo?.cell?.id),
      staleTime: 10 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
    }
  )

  return (
    <>
      <SectionTitle title="셀정보" />
      <Spacer size={'h-3'} />
      {isLoading ? (
        <div className="flex justify-center">
          <Spinner />
        </div>
      ) : data !== undefined ? (
        <>
          <CellStatsGroup
            totalNumber={data.findCell.statistics.totalCountOfMembers}
            activeNumber={data.findCell.statistics.countOfActiveMembers}
          />
          <Spacer size={'h-4 lg:h-8'} />
          <div className="grid grid-cols-1 gap-y-4 lg:grid-cols-3 lg:gap-y-0 lg:gap-x-4">
            <div className="lg:col-span-1">
              <CellGenderStatic
                maleMembers={
                  data.findCell.members.filter(
                    (member) => member.gender === 'MAN'
                  ).length
                }
                femaleMembers={
                  data.findCell.members.filter(
                    (member) => member.gender === 'WOMAN'
                  ).length
                }
              />
            </div>
            <div className="lg:col-span-2">
              <CellAgeStatic data={groupBy(data.findCell.members)} />
            </div>
          </div>
        </>
      ) : (
        <EmptyStateSimple />
      )}
    </>
  )
}

export default CellInfomationScreen
