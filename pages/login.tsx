import { getDocs, query, where } from 'firebase/firestore'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Layout from '../components/layout'
import { IUser } from '../types/firebase'
import { createCollectionData, getCollection, loginWithGoogle, updateCollectionData } from '../utils/firebase'

const Login: NextPage = () => {
  const router = useRouter()

  const isNewUser = async (uid: string) => {
    const _query = query(getCollection('user'), where('googleUid', '==', uid))

    try {
      const { empty } = await getDocs(_query)
      return empty
    } catch (error) {
      console.log(error)
      return false
    }
  }

  const handleLogin = async () => {
    try {
      const { user } = await loginWithGoogle()
      const isNew = await isNewUser(user.uid)

      if (isNew) {
        const _userData: IUser = {
          class_ids: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          email: user.email || '',
          googleUid: user.uid,
          id: '',
          name: user.displayName || `anon`,
        }
        const response = await createCollectionData('user', _userData)
        await updateCollectionData('user', response.id, { ..._userData, id: response.id })
      }

      router.push('/')
    } catch (error) {
      console.log(error)
      alert('로그인중 에러발생, 다시 로그인 해주세요.')
      router.reload()
    }
  }
  return (
    <Layout>
      <main className="mx-auto mt-10 flex w-full max-w-screen-sm flex-col items-center  overflow-hidden rounded-md border border-zinc-300 bg-zinc-100">
        <header className="relative w-full bg-zinc-300 p-3">
          <h1 className={'text-center text-4xl font-bold'}>로그인</h1>
          <button
            onClick={() => {
              router.push('/')
            }}
            className={'absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-zinc-100 p-1'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6 stroke-zinc-500"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        </header>
        <div className={'w-full p-10'}>
          <button onClick={handleLogin} className="relative mx-auto w-full rounded-md bg-red-500 p-3 px-5 text-center font-bold text-white">
            <span>구글 계정으로 로그인</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="absolute top-1/2 left-3 h-8 w-8 -translate-y-1/2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
              />
            </svg>
          </button>
        </div>
      </main>
    </Layout>
  )
}

export default Login
