import graphlqlRequestClient from '@/client/graphqlRequestClient'
import Container from '@/components/Atoms/Container/Container'
import EmptyStateSimple from '@/components/Atoms/EmptyStates/EmptyStateSimple'
import Spacer from '@/components/Atoms/Spacer'
import Spinner from '@/components/Atoms/Spinner'
import UserInfomation from '@/components/Blocks/Cards/UserInfomation'
import UserInfomationForm from '@/components/Blocks/Forms/UserInfomationForm'
import Header from '@/components/Blocks/Headers/Header'
import {
  FindMyCellMemberQuery,
  FindMyCellMemberQueryVariables,
  FindUsersQuery,
  FindUsersQueryVariables,
  useFindMyCellMemberQuery,
  useFindUsersQuery,
} from '@/graphql/generated'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

interface CellMemberDetailScreenProps {}

const CellMemberDetailScreen = ({}: CellMemberDetailScreenProps) => {
  const router = useRouter()
  const [userId, setUserId] = useState<string>('')
  const [editMode, setEditMode] = useState(false)
  const { isLoading, data } = useFindMyCellMemberQuery<
    FindMyCellMemberQuery,
    FindMyCellMemberQueryVariables
  >(
    graphlqlRequestClient,
    {
      id: userId,
    },
    {
      enabled: userId !== '',
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    }
  )

  useEffect(() => {
    if (router.isReady) {
      if (typeof router.query.id === 'string') {
        setUserId(router.query.id)
      } else {
        setUserId('')
      }
    }
  }, [router])

  return (
    <>
      {isLoading ? (
        <div className="w-full py-20 flex items-center justify-center">
          <Spinner />
        </div>
      ) : data ? (
        <>
          <Header
            cellId={data.user.cell?.id}
            cellName={data.user.cell?.name}
            userName={data.user.name}
            editMode={editMode}
            setEditMode={setEditMode}
          />
          <Container>
            {!editMode ? (
              <UserInfomation
                name={data.user.name}
                gender={data.user.gender}
                isActive={data.user.isActive}
                birthday={data.user.birthday}
                phone={data.user.phone}
                address={data.user.address}
                description={data.user.description}
              />
            ) : (
              <UserInfomationForm
                id={data.user.id}
                name={data.user.name}
                gender={data.user.gender}
                isActive={data.user.isActive}
                birthday={data.user.birthday}
                phone={data.user.phone}
                address={data.user.address}
                description={data.user.description}
                cell={data.user.cell}
              />
            )}
          </Container>
        </>
      ) : (
        <EmptyStateSimple />
      )}
      <Spacer size={'h-8'} />
    </>
  )
}

export default CellMemberDetailScreen
