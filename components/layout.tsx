/* eslint-disable react/prop-types */
import { signOut } from 'firebase/auth'
import Link from 'next/link'
import { PropsWithChildren, useContext } from 'react'
import { UserContext } from '../Providers/UserProvider'
import { fbAuth } from '../utils/firebase'

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const { isLoading, user } = useContext(UserContext)
  const handleClick = () => signOut(fbAuth)
  return (
    <div className="min-h-screen w-full">
      <header className="fixed top-0 left-0 flex w-full items-center justify-between bg-zinc-200 p-3 px-5">
        <Link href={'/'}>
          <a>
            <h1 className={'rounded-md bg-zinc-100 p-2 text-2xl font-bold text-zinc-800'}>Student Manager</h1>
          </a>
        </Link>
        {!isLoading && !user ? (
          <Link href={'/login'}>
            <a className={'flex cursor-pointer items-center gap-1'}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                />
              </svg>
              <span className="font-medium">로그인</span>
            </a>
          </Link>
        ) : (
          <button onClick={handleClick} className={'flex items-center gap-1'}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
              />
            </svg>
            <span className="font-medium">로그아웃</span>
          </button>
        )}
      </header>
      <div className="w-full pt-20">{children}</div>
    </div>
  )
}

export default Layout
