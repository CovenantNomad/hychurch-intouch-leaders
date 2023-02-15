import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '@/hooks/useAuth'
import { mainMenu } from '@/constants/menu'

interface SidebarProps {}

const Sidebar = ({}: SidebarProps) => {
  const router = useRouter()
  const { onLogOutHandler } = useAuth()

  return (
    <div
      className={`hidden fixed left-0 top-0 bottom-0 flex-col flex-nowrap overflow-hidden z-[2000] px-6 transition-all duration-300 bg-white lg:flex lg:shadow-xl lg:w-60`}
    >
      <div className="py-6">
        <h1 className="text-xl font-bold text-black">INTOUCH CHURCH</h1>
        <span className="block text-gray-400 text-sm">
          {new Date().toLocaleDateString('kr-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            weekday: 'short',
          })}
        </span>
      </div>
      <div className="flex flex-col gap-y-3">
        <Link href={'/home'}>
          <div
            className={`group w-full flex items-center py-4 rounded-lg ${
              router.pathname === '/home' && 'bg-lightblue/60'
            } hover:bg-lightblue/30`}
          >
            <span
              className={`block w-full text-base text-center text-gray-500 font-notosans`}
            >
              {'🏠'} {'첫페이지'}
            </span>
          </div>
        </Link>
        {mainMenu.map((item) => (
          <Link href={item.pathname} key={item.id}>
            <div
              className={`group w-full flex items-center py-4 rounded-lg ${
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
      <div className="w-full text-center mt-32 py-4 rounded-lg hover:bg-lightblue/30">
        <button onClick={onLogOutHandler}>
          <span className="text-gray-600">🔚 로그아웃</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar
