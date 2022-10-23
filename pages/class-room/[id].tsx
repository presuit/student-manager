/* eslint-disable react/prop-types */
import { doc, onSnapshot } from 'firebase/firestore'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ClassAddStudentModal from '../../components/AddStudentModal'
import Layout from '../../components/layout'
import LoadingSpinner from '../../components/LoadingSpinner'
import { useUser } from '../../hooks/useUser'
import { IClass } from '../../types/firebase'
import { fbDb } from '../../utils/firebase'

const ClassDetail: NextPage = () => {
  const user = useUser()
  const router = useRouter()
  const [classInfo, setClassInfo] = useState<IClass>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!router.query.id) {
      router.replace('/')
    }
    onSnapshot(doc(fbDb, `class/${router.query.id}`), doc => {
      setLoading(true)
      if (doc.exists()) {
        setClassInfo(doc.data() as IClass)
      }
      setLoading(false)
    })
  }, [])
  return (
    <Layout>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="flex flex-col gap-5 p-5 pb-10">
          <h1 className="w-full rounded-md bg-zinc-100 p-5 text-center text-4xl font-bold text-zinc-800 shadow-md">{classInfo?.name}</h1>
          <div className="flex w-full gap-5 ">
            <ul className="flex h-full min-h-screen flex-col items-center gap-5 overflow-auto rounded-md bg-zinc-100 p-5 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 fill-zinc-500">
                <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
              </svg>
              {classInfo?.student_ids.map(sId => {
                return (
                  <li key={sId} className="rounded-md bg-white p-3 px-10 text-lg font-medium text-zinc-800 shadow-md">
                    {sId}
                  </li>
                )
              })}
            </ul>
            <section className="flex-1 rounded-md bg-zinc-200 shadow-md"></section>
          </div>
          <ClassAddStudentModal classId={(router.query.id as string) || ''} />
        </div>
      )}
    </Layout>
  )
}

export default ClassDetail
