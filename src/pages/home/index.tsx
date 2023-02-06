import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
//components
import { mainMenu } from 'src/constants/menu'
import Layout from '@components/Atoms/Layout/Layout'
import Container from '@components/Atoms/Container/Container'
import Spacer from '@components/Atoms/Spacer'
import CardWithIcon from '@components/Blocks/Cards/CardWithIcon'

interface HomeProps {}

const Home = ({}: HomeProps) => {
  return (
    <Layout>
      <Head>
        <title>Home | INTOUCH CHURCH</title>
        <meta name="description" content="Generated by create next app" />
      </Head>

      <Container>
        <Spacer size={'h-6'} />
        <h4 className="text-2xl font-bold tracking-wide">Hi 정훈 👋</h4>
        <Spacer size={'h-3'} />
        <p className="text-xl font-nanumBrush font-bold tracking-wide bg-lightgreen py-4 rounded-lg text-center">
          <span className="block font-poppins text-xs uppercase mb-1">
            2023 anointing hwayang vision
          </span>
          부흥,
          <br /> 네 입을 크게 열라 내가 채우리라
        </p>
        <Spacer />
        <h5 className="text-xl pl-3">
          Your <strong className="font-bold">Mission</strong>
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

export default Home
