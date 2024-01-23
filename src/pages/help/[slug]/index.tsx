import Layout from '@/components/Atoms/Layout/Layout'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { type CarouselApi } from '@/components/ui/carousel'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'

type HelpDetailPageProps = {}

const HelpDetailPage = ({}: HelpDetailPageProps) => {
  const router = useRouter()
  const { slug, numOfImages } = router.query
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  const generateImagePaths = (slug: string, numOfImages: string) => {
    // Define how many images you expect per slug or find a way to determine this
    const paths = []

    for (let i = 1; i <= Number(numOfImages); i++) {
      paths.push(`/images/${slug}_00${i}.jpeg`)
    }

    return paths
  }

  const imagePaths = slug
    ? generateImagePaths(String(slug), String(numOfImages))
    : ['/images/thumbnail.png']

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <Layout>
      <Head>
        <title>셀원정보 | INTOUCH CHURCH</title>
      </Head>
      <div className="border-t py-1 lg:border-t-0 lg:py-3 lg:px-6">
        <button onClick={router.back} className="flex p-2">
          <ChevronLeftIcon className="h-5 w-5" />
          <span className="text-base ml-1">뒤로</span>
        </button>
      </div>

      <Carousel setApi={setApi} className="lg:hidden">
        <CarouselContent>
          {imagePaths.map((image, index) => (
            <CarouselItem key={index} className="w-full">
              <Card className="rounded-none">
                <CardContent className="relative flex aspect-[3/4] items-center justify-center">
                  <Image
                    src={image}
                    fill
                    sizes="(max-width: 600px) 100vw"
                    alt="이미지"
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="ml-14" />
        <CarouselNext className="mr-14" />
      </Carousel>
      <div className="py-2 text-center text-sm text-gray-400 lg:hidden">
        Slide {current} of {count}
      </div>

      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-4 lg:px-6 2xl:grid-cols-4">
        {imagePaths.map((image, index) => (
          <Card key={index} className="rounded-none">
            <CardContent className="relative flex aspect-[3/4] items-center justify-center">
              <Image src={image} fill alt="이미지" />
            </CardContent>
          </Card>
        ))}
      </div>
    </Layout>
  )
}

export default HelpDetailPage
