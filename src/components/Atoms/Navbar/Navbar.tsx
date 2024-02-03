import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import HamburgerMenu from '../HamburgerMenu/HamburgerMenu'
import { useRouter } from 'next/router'
import { mainMenu } from '@/constants/menu'
import { INTOUCH_LEADERS_ACCESS_TOKEN } from '@/constants/constants'
import graphlqlRequestClient from '@/client/graphqlRequestClient'
import { useSetRecoilState } from 'recoil'
import { stateUserInfo } from '@/stores/stateUserInfo'
import { useAuth } from '@/hooks/useAuth'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Avatar, AvatarImage } from '@/components/ui/avatar'

interface NavbarProps {}

const Navbar = ({}: NavbarProps) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const { onLogOutHandler } = useAuth()

  return (
    // <>
    //   <div className="h-16 flex justify-between items-center px-4 md:px-6 lg:hidden">
    //     <HamburgerMenu isOpen={isOpen} setIsOpen={setIsOpen} />
    //     <button>
    //       <Image
    //         src={'/images/Intouch_logo.png'}
    //         height={40}
    //         width={40}
    //         alt="인터치교회 로고"
    //         className="cursor-pointer"
    //       />
    //     </button>
    //   </div>
    //   {isOpen && (
    //     <div
    //       className={`h-full w-full absolute top-16 left-0 bg-white z-[2000] flex flex-col gap-y-4 lg:hidden`}
    //     >
    //       <Link href={'/home'}>
    //         <div
    //           className={`group w-full flex items-center py-6 ${
    //             router.pathname === '/home' && 'bg-lightblue/60'
    //           } hover:bg-lightblue/30`}
    //         >
    //           <span className="block w-full text-base text-gray-600 text-center font-notosans">
    //             {'🏠'} {'첫페이지'}
    //           </span>
    //         </div>
    //       </Link>
    //       {mainMenu.map((item) => (
    //         <Link href={item.pathname} key={item.id}>
    //           <div
    //             className={`group w-full flex items-center py-6 px-4 ${
    //               router.pathname === item.pathname && 'bg-lightblue/60'
    //             } hover:bg-lightblue/30`}
    //           >
    //             <span className="block w-full text-base text-gray-600 text-center font-notosans">
    //               {item.icon} {item.title}
    //             </span>
    //           </div>
    //         </Link>
    //       ))}
    //       <div className="w-full text-center mt-20 py-6 rounded-lg hover:bg-lightblue/30">
    //         <button onClick={onLogOutHandler}>
    //           <span className="text-gray-600">🔚 로그아웃</span>
    //         </button>
    //       </div>
    //       <Link href={'/help'} className="w-full text-center mt-6">
    //         <span className="text-sm text-cyan-800 underline cursor-pointer">
    //           리더십 사관학교
    //         </span>
    //       </Link>
    //       <div className="w-full text-center">
    //         <a
    //           href="https://cactus-flannel-eb8.notion.site/d92d59904fb847c5934ea8bc5f711594?pvs=4"
    //           target="_blank"
    //           rel="noreferrer"
    //           className="text-sm text-cyan-800 underline cursor-pointer"
    //         >
    //           인터치 리더스 사용설명서
    //         </a>
    //       </div>
    //     </div>
    //   )}
    // </>
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <div className="h-16 flex justify-between items-center px-4 md:px-6 lg:hidden">
        <SheetTrigger asChild>
          <HamburgerMenu isOpen={isOpen} setIsOpen={setIsOpen} />
        </SheetTrigger>
        <Avatar>
          <AvatarImage src="/images/Intouch_logo.png" />
        </Avatar>
      </div>
      <SheetContent side={'left'} className="w-60">
        <div className="py-10">
          <div className="w-full flex flex-col space-y-2">
            <Link href={'/home'}>
              <div
                className={`group w-full flex items-center py-3 ${
                  router.pathname === '/home' && 'bg-lightblue/60'
                } hover:bg-lightblue/30`}
              >
                <span className="block w-full text-base text-gray-600 text-center font-notosans">
                  {'🏠'} {'첫페이지'}
                </span>
              </div>
            </Link>
            {mainMenu.map((item) => (
              <Link href={item.pathname} key={item.id}>
                <div
                  className={`group w-full flex items-center py-6 px-4 ${
                    router.pathname === item.pathname && 'bg-lightblue/60'
                  } hover:bg-lightblue/30`}
                >
                  <span className="block w-full text-base text-gray-600 text-center font-notosans">
                    {item.icon} {item.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="w-full text-center mt-10 py-6 rounded-lg hover:bg-lightblue/30">
            <button onClick={onLogOutHandler}>
              <span className="text-gray-600">🔚 로그아웃</span>
            </button>
          </div>
          <div className="w-full flex flex-col items-center space-y-3 mt-6">
            <Link href={'/help'} className="w-full text-center">
              <span className="text-sm text-cyan-800 underline cursor-pointer">
                리더십 사관학교
              </span>
            </Link>
            <div className="w-full text-center">
              <a
                href="https://cactus-flannel-eb8.notion.site/d92d59904fb847c5934ea8bc5f711594?pvs=4"
                target="_blank"
                rel="noreferrer"
                className="text-sm text-cyan-800 underline cursor-pointer"
              >
                인터치 리더스 사용설명서
              </a>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default Navbar
