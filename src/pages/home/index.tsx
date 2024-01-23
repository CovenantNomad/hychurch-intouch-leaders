import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
// states
import { useRecoilValue } from 'recoil'
import { stateUserInfo } from '@/stores/stateUserInfo'
// constants
import { mainMenu } from '@/constants/menu'
//components
import Layout from '@components/Atoms/Layout/Layout'
import Container from '@components/Atoms/Container/Container'
import Spacer from '@components/Atoms/Spacer'
import CardWithIcon from '@components/Blocks/Cards/CardWithIcon'

interface HomeProps {}

const Home = ({}: HomeProps) => {
  const userInfo = useRecoilValue(stateUserInfo)

  return (
    <Layout>
      <Head>
        <title>홈 | INTOUCH CHURCH</title>
      </Head>

      <Container>
        <Spacer size={'h-6'} />
        <p className="w-fit bg-black text-white px-2 py-1">Worship Master</p>
        <h4 className="text-2xl font-bold tracking-wide whitespace-pre-line">
          {userInfo?.name} 리더님 👋
        </h4>
        <Spacer size={'h-3'} />
        <p className="text-base font-nanumBrush font-bold tracking-wide bg-lightgreen py-4 rounded-lg text-center">
          <span className="block font-poppins text-xs uppercase mb-1 text-rose-800">
            2024 상반기 인터치 비전
          </span>
          예수 그리스도 안에서
          <br /> 삶이 예배가 되고 예배가 삶이 되는 워십마스터
        </p>
        <Spacer />
        <h5 className="text-xl pl-3">
          Your <strong className="font-bold">Activity</strong>
        </h5>
        <Spacer size={'h-3'} />
        <div className="grid grid-cols-2 gap-3">
          {mainMenu.map((menu) => (
            <Link key={menu.id} href={menu.pathname}>
              <CardWithIcon
                title={menu.title}
                icon={menu.icon}
                bg={menu.color}
              />
            </Link>
          ))}
        </div>
      </Container>
    </Layout>
  )
}

// export async function getServerSideProps() {
//   const getMe = gql`
//     query me {
//       me {
//         id
//         name
//         roles
//         cell {
//           id
//           name
//         }
//       }
//     }
//   `
//   const posts = await graphQLClient.request(getMe)
//   console.log(posts)
//   return { props: { posts } }
// }

export default Home
