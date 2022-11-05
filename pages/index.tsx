import dayjs from 'dayjs'
import { getDocs, onSnapshot, query, where } from 'firebase/firestore'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import AddClassModal from '../components/AddClassModal'
import Layout from '../components/layout'
import LoadingSpinner from '../components/LoadingSpinner'
import { UserContext } from '../Providers/UserProvider'
import { IClass, IUser } from '../types/firebase'
import { getCollection } from '../utils/firebase'

const Home: NextPage = () => {
  const { isLoading: userCtxLoading, user } = useContext(UserContext)
  const [loading, setLoading] = useState(true)
  const [fsUser, setFsUser] = useState<IUser>()
  const [classes, setClasses] = useState<IClass[]>([])
  const router = useRouter()
  const isLoading = userCtxLoading || loading

  const fetchUser = async (uid: string) => {
    setLoading(true)
    const _query = query(getCollection('user'), where('googleUid', '==', uid))
    try {
      const queryResult = await getDocs(_query)
      if (!queryResult.empty && queryResult.docs[0].exists()) {
        setFsUser(queryResult.docs[0].data() as IUser)
      }
    } catch (error) {
      console.log(error)
      setFsUser(undefined)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!userCtxLoading) {
      if (user) {
        onSnapshot(getCollection('class'), docs => {
          const container: IClass[] = []
          docs.forEach(doc => {
            if (doc.exists()) {
              const data = doc.data() as IClass
              if (data.teacher_id === user.uid) {
                container.push(data)
              }
            }
          })
          setClasses(container)
        })
      } else {
        router.replace('/login')
      }
    }
  }, [userCtxLoading, user])

  useEffect(() => {
    if (user) {
      fetchUser(user.uid)
    }
  }, [user])

  return (
    <Layout>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <main className="w-full p-5 pb-20">
            <div className="w-full overflow-hidden rounded-md p-5">
              {/* <h2 className="rounded-md bg-zinc-100 p-3 text-2xl font-bold text-zinc-800 shadow-md">반갑습니다 {fsUser?.name}님</h2> */}
              <ul className="mt-5 grid w-full grid-cols-4 gap-5 rounded-2xl bg-zinc-100 p-5 pb-20 pt-10 shadow-md">
                {classes
                  .sort((a, b) => {
                    const aNames = a.name
                      .split('')
                      .filter(item => !isNaN(+item))
                      .map(item => +item)
                    const bNames = b.name
                      .split('')
                      .filter(item => !isNaN(+item))
                      .map(item => +item)
                    if (aNames.length > 0 && bNames.length > 0) {
                      if (aNames[0] !== bNames[0]) {
                        return aNames[0] - bNames[0]
                      } else {
                        const maxLength = Math.min(aNames.length, bNames.length)
                        for (let i = 1; i < maxLength; i++) {
                          if (aNames[i] !== bNames[i]) {
                            return aNames[i] - bNames[i]
                          }
                        }
                      }
                    }

                    return dayjs(a.created_at).unix() - dayjs(b.created_at).unix()
                  })
                  .map(item => {
                    return (
                      <Link key={item.id} href={`/class-room/${item.id}`}>
                        <a className="flex aspect-video w-full flex-col overflow-hidden rounded-md border border-zinc-300 bg-zinc-200 shadow-md">
                          <h3 className="bg-zinc-300 px-5 py-3 text-lg font-medium text-zinc-800">{item.name}</h3>
                          <button className="flex w-full flex-1 items-center justify-center gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="h-6 w-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5"
                              />
                            </svg>
                            <span className="text-lg font-medium">관리하기</span>
                          </button>
                        </a>
                      </Link>
                    )
                  })}
              </ul>
            </div>
          </main>
          <AddClassModal />
        </>
      )}
    </Layout>
  )
}

export default Home
