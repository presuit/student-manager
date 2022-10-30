import { useEffect, useState } from 'react'
import { IClass, IStudent } from '../types/firebase'
import { updateCollectionData } from '../utils/firebase'

interface IProps {
  data: IStudent
  classInfo?: IClass
}

const ClassStudent = ({ data, classInfo }: IProps) => {
  const [modalOpen, setModalOpen] = useState(false)
  const handleDeleteStudentFromClass = async () => {
    if (!classInfo) return

    try {
      await updateCollectionData('class', classInfo.id, { ...classInfo, student_ids: [...classInfo.student_ids.filter(id => id !== data.id)] })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  console.log(modalOpen)

  return (
    <>
      <li
        onClick={() => setModalOpen(true)}
        className="flex w-full max-w-[200px] cursor-pointer items-center gap-3 text-lg font-medium text-zinc-800"
      >
        <span className="w-[120px] flex-1 break-words rounded-md bg-white p-3 text-center">{data.name}</span>
        {/* <button onClick={handleDeleteStudentFromClass} className="rounded-full bg-white p-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5 stroke-red-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
          />
        </svg>
      </button> */}
      </li>
      {modalOpen && (
        <aside className={'fixed top-0 left-0 z-10 h-screen w-full'}>
          <div onClick={() => setModalOpen(false)} className={'absolute top-0 left-0 z-20 h-full w-full cursor-pointer bg-black bg-opacity-50'} />
          <main className={'absolute bottom-0 left-0 z-30 flex h-[50vh] w-full flex-col gap-5 overflow-auto bg-white p-10'}>
            <span className={'text-2xl font-bold'}>{data.name}</span>
            <div className={'inline-flex  rounded-md border border-zinc-300 bg-zinc-100'}>
              <span className={'border-r border-zinc-300 p-3 text-lg font-medium'}>주소</span>
              <span className="p-3">{data.address}</span>
            </div>
            <div className={'inline-flex  rounded-md border border-zinc-300 bg-zinc-100'}>
              <span className={'border-r border-zinc-300 p-3 text-lg font-medium'}>생년월일</span>
              <span className="p-3">{data.birth_date}</span>
            </div>
            <div className={'inline-flex  rounded-md border border-zinc-300 bg-zinc-100'}>
              <span className={'border-r border-zinc-300 p-3 text-lg font-medium'}>휴대폰 번호</span>
              <span className="p-3">{data.phone_number}</span>
            </div>
            <div className={'inline-flex  rounded-md border border-zinc-300 bg-zinc-100'}>
              <span className={'border-r border-zinc-300 p-3 text-lg font-medium'}>학교 인적사항</span>
              <span className="p-3">
                {data.school.name}학교 {data.school.grade}학년 {data.school.class}반
              </span>
            </div>
            <div className={'inline-flex  rounded-md border border-zinc-300 bg-zinc-100'}>
              <span className={'border-r border-zinc-300 p-3 text-lg font-medium'}>재학생 여부</span>
              <span className="p-3">{data.is_academian ? 'Y' : 'N'}</span>
            </div>
          </main>
        </aside>
      )}
    </>
  )
}

export default ClassStudent
