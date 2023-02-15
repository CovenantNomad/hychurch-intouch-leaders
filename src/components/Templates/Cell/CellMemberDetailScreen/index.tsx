import graphlqlRequestClient from '@/client/graphqlRequestClient'
import Container from '@/components/Atoms/Container/Container'
import EmptyStateSimple from '@/components/Atoms/EmptyStates/EmptyStateSimple'
import Spacer from '@/components/Atoms/Spacer'
import Spinner from '@/components/Atoms/Spinner'
import UserInfomation from '@/components/Blocks/Cards/UserInfomation'
import UserInfomationForm from '@/components/Blocks/Forms/UserInfomationForm'
import Header from '@/components/Blocks/Headers/Header'
import {
  FindUsersQuery,
  FindUsersQueryVariables,
  useFindUsersQuery,
} from '@/graphql/generated'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

interface CellMemberDetailScreenProps {}

const CellMemberDetailScreen = ({}: CellMemberDetailScreenProps) => {
  const router = useRouter()
  const [editMode, setEditMode] = useState(false)
  const { isLoading, data } = useFindUsersQuery<
    FindUsersQuery,
    FindUsersQueryVariables
  >(
    graphlqlRequestClient,
    {
      name: typeof router.query.slug === 'string' ? router.query.slug : null,
    },
    {
      staleTime: 3 * 60 * 1000,
    }
  )

  return (
    <>
      {isLoading ? (
        <div className="w-full py-20 flex items-center justify-center">
          <Spinner />
        </div>
      ) : data ? (
        <>
          <Header
            cellId={data?.findUsers.nodes[0].cell?.id}
            cellName={data?.findUsers.nodes[0].cell?.name}
            userName={data?.findUsers.nodes[0].name}
            editMode={editMode}
            setEditMode={setEditMode}
          />
          <Container>
            {!editMode ? (
              <UserInfomation
                name={data.findUsers.nodes[0].name}
                gender={data.findUsers.nodes[0].gender}
                isActive={data.findUsers.nodes[0].isActive}
                birthday={data.findUsers.nodes[0].birthday}
                phone={data.findUsers.nodes[0].phone}
                address={data.findUsers.nodes[0].address}
                description={data.findUsers.nodes[0].description}
              />
            ) : (
              <UserInfomationForm
                id={data.findUsers.nodes[0].id}
                name={data.findUsers.nodes[0].name}
                gender={data.findUsers.nodes[0].gender}
                isActive={data.findUsers.nodes[0].isActive}
                birthday={data.findUsers.nodes[0].birthday}
                phone={data.findUsers.nodes[0].phone}
                address={data.findUsers.nodes[0].address}
                description={data.findUsers.nodes[0].description}
                cell={data.findUsers.nodes[0].cell}
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
