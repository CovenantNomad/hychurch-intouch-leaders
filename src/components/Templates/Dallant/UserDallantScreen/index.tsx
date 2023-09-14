import React from 'react'
import UserDallantHeader from '@/components/Organisms/Dallant/UserDallantHeader'
import UserDallantHistory from '@/components/Organisms/Dallant/UserDallantHistory'
import { useRouter } from 'next/router'

interface UserDallantScreenProps {}

const UserDallantScreen = ({}: UserDallantScreenProps) => {
  const router = useRouter()
  const { id, userName, totalAmount, isLeader } = router.query

  return (
    <div>
      <UserDallantHeader
        id={String(id)}
        userName={String(userName)}
        totalAmount={Number(totalAmount)}
        isLeader={isLeader === 'true' ? true : false}
        goBack={() => router.back()}
      />
      <UserDallantHistory id={String(id)} />
    </div>
  )
}

export default UserDallantScreen
