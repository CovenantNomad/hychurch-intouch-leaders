import graphlqlRequestClient from '@/client/graphqlRequestClient'
import Container from '@/components/Atoms/Container/Container'
import EmptyStateSimple from '@/components/Atoms/EmptyStates/EmptyStateSimple'
import Skeleton from '@/components/Atoms/Skeleton'
import Spacer from '@/components/Atoms/Spacer'
import UserInfomation from '@/components/Blocks/Cards/UserInfomation'
import UserInfomationForm from '@/components/Blocks/Forms/UserInfomationForm'
import Header from '@/components/Blocks/Headers/Header'
import {
  FindMyCellMemberQuery,
  FindMyCellMemberQueryVariables,
  useFindMyCellMemberQuery,
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
      staleTime: 10 * 60 * 1000,
      cacheTime: 15 * 60 * 1000,
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
        <>
          <div className="flex items-center justify-between space-x-5 py-4 px-4 md:py-7 md:px-6 lg:px-8 bg-white">
            <div className="flex items-center">
              <Skeleton className="w-20 rounded-md">
                <div className="h-3  rounded-lg bg-gray-200"></div>
              </Skeleton>
              <svg className="w-6 h-6 mx-2 fill-gray-200" viewBox="0 0 20 20">
                <path d="M11.611,10.049l-4.76-4.873c-0.303-0.31-0.297-0.804,0.012-1.105c0.309-0.304,0.803-0.293,1.105,0.012l5.306,5.433c0.304,0.31,0.296,0.805-0.012,1.105L7.83,15.928c-0.152,0.148-0.35,0.223-0.547,0.223c-0.203,0-0.406-0.08-0.559-0.236c-0.303-0.309-0.295-0.803,0.012-1.104L11.611,10.049z"></path>
              </svg>
              <Skeleton className="w-20 rounded-md">
                <div className="h-3  rounded-lg bg-gray-200"></div>
              </Skeleton>
            </div>
            <div>
              <Skeleton className="rounded-md">
                <div className="h-10 w-12 rounded-md bg-gray-200"></div>
              </Skeleton>
            </div>
          </div>
          <Container>
            <div className="space-y-5 p-4 border rounded-lg">
              <Skeleton className="rounded-lg">
                <div className="h-24 rounded-lg bg-gray-300"></div>
              </Skeleton>
              <div className="space-y-3">
                <Skeleton className="w-3/5 rounded-lg">
                  <div className="h-3 w-3/5 rounded-lg bg-gray-200"></div>
                </Skeleton>
                <Skeleton className="w-4/5 rounded-lg">
                  <div className="h-3 w-4/5 rounded-lg bg-gray-200"></div>
                </Skeleton>
                <Skeleton className="w-2/5 rounded-lg">
                  <div className="h-3 w-2/5 rounded-lg bg-gray-300"></div>
                </Skeleton>
              </div>
            </div>
            <div className="space-y-5 p-4 border rounded-lg mt-2">
              <div className="space-y-3">
                <Skeleton className="w-2/5 rounded-lg">
                  <div className="h-3 w-2/5 rounded-lg bg-gray-200"></div>
                </Skeleton>
                <Skeleton className="w-4/5 rounded-lg">
                  <div className="h-3 w-4/5 rounded-lg bg-gray-200"></div>
                </Skeleton>
              </div>
            </div>
          </Container>
        </>
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
                grade={data.user.grade}
                isActive={data.user.isActive}
                birthday={data.user.birthday}
                phone={data.user.phone}
                address={data.user.address}
                description={data.user.description}
                registrationDate={data.user.registrationDate}
              />
            ) : (
              <UserInfomationForm
                id={data.user.id}
                name={data.user.name}
                gender={data.user.gender}
                grade={data.user.grade}
                isActive={data.user.isActive}
                birthday={data.user.birthday}
                phone={data.user.phone}
                address={data.user.address}
                description={data.user.description}
                registrationYear={data.user.registrationDate?.split('-')[0]}
                registrationMonth={data.user.registrationDate?.split('-')[1]}
                registrationDay={data.user.registrationDate?.split('-')[2]}
                editModeHandler={setEditMode}
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
