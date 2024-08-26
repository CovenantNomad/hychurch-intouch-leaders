import Container from '@/components/Atoms/Container/Container'
import Layout from '@/components/Atoms/Layout/Layout'
import Spacer from '@/components/Atoms/Spacer'
import Head from 'next/head'
import Link from 'next/link'

const data = [
  {
    id: 0,
    theme: '2024\n리더십 사관학교',
    title: '2024 비전나눔',
    slug: 'vision',
    numOfImages: 2,
  },
  {
    id: 1,
    theme: '2024\n리더십 사관학교',
    title: '2024 인터치 교회 매뉴얼',
    slug: 'manual',
    numOfImages: 4,
  },
  {
    id: 2,
    theme: '2024\n리더십 사관학교',
    title: '은혜로운 셀리더 생활',
    slug: 'leader',
    numOfImages: 2,
  },
]

const HelpPage = () => {
  return (
    <Layout>
      <Head>
        <title>리더십 사관학교 | INTOUCH CHURCH</title>
      </Head>
      <Container>
        <Spacer size={'h-2 lg:h-6'} />
        <h4 className="text-2xl font-bold tracking-wide">
          2024 리더쉽 사관학교
        </h4>
        <Spacer size={'h-6'} />
        <section className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-6">
          {data &&
            data.map((item) => (
              <Link
                key={item.id}
                href={{
                  pathname: `/help/${item.slug}`,
                  query: { numOfImages: item.numOfImages },
                }}
                as={`/help/${item.slug}`}
              >
                <div
                  className={
                    'h-[210px] w-full border rounded-lg border-solid bg-[#EAE0C5] pt-4 px-4 text-sm lg:text-base'
                  }
                >
                  <span className="block text-[#94311C] font-bold">
                    {item.theme.split('\n')[0]}
                  </span>
                  <span className="block text-[#5B7A6A] font-bold">
                    {item.theme.split('\n')[1]}
                  </span>
                  <span className="block text-center mt-12 font-bold lg:mt-8">
                    {item.title}
                  </span>
                </div>
                <div className="py-2">
                  <p className="text-sm">{item.title}</p>
                </div>
              </Link>
            ))}
        </section>
      </Container>
    </Layout>
  )
}

export default HelpPage
