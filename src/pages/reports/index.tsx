//components
import Spacer from '@/components/Atoms/Spacer'
import { stateUserInfo } from '@/stores/stateUserInfo'
import Layout from '@components/Atoms/Layout/Layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useRecoilValue } from 'recoil'

interface ReportsProps {}

const Reports = ({}: ReportsProps) => {
  const router = useRouter()
  const userInfo = useRecoilValue(stateUserInfo)

  return (
    <Layout>
      <Head>
        <title>셀보고서 | INTOUCH CHURCH</title>
      </Head>

      <Spacer size={'h-2 lg:h-6'} />
      <h4 className="text-2xl font-bold tracking-wide px-4 md:px-6 lg:px-8">
        {userInfo?.cell?.name || '셀이름'}
      </h4>
      <Spacer size={'h-6'} />
    </Layout>
  )
}

export default Reports
