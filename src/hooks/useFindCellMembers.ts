import graphlqlRequestClient from '@/client/graphqlRequestClient'
import {
  FindMyCellMembersQuery,
  FindMyCellMembersQueryVariables,
  useFindMyCellMembersQuery,
} from '@/graphql/generated'

export const useFindCellMembers = () => {
  return useFindMyCellMembersQuery<
    FindMyCellMembersQuery,
    FindMyCellMembersQueryVariables
  >(
    graphlqlRequestClient,
    {},
    {
      staleTime: 10 * 60 * 1000,
      cacheTime: 15 * 60 * 1000,
    }
  )
}
