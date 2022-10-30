import { getDocs, query, where } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { IBookInfo, IClass, IDailyBooking } from '../types/firebase'
import { createCollectionData, getCollection, updateCollectionData } from '../utils/firebase'
import AddBookInfoModal from './AddBookInfoModal'
import DailyBookingItem from './DailyBookingItem'

interface IProps {
  data?: IDailyBooking
  currentDate: string
  refetch: () => void
}

const ClassDailyBooking = ({ data, currentDate, refetch }: IProps) => {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [bookInfos, setBookInfos] = useState<IBookInfo[]>([])

  const fetchBookInfos = async () => {
    if (!data) return
    const container: IBookInfo[] = []
    try {
      for (const id of data?.book_info_ids ?? []) {
        const _query = query(getCollection('book_info'), where('id', '==', id))
        const docs = await getDocs(_query)
        if (!docs.empty) {
          container.push(docs.docs[0].data() as IBookInfo)
        }
      }
    } catch (error) {
      console.log(error)
    } finally {
      setBookInfos(container)
    }
  }

  const createNewDailiyBooking = async () => {
    const _data: IDailyBooking = {
      id: '',
      book_info_ids: [],
      class_id: router.query.id as string,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      date: currentDate,
    }
    try {
      const { id } = await createCollectionData('daily_booking', _data)
      await updateCollectionData('daily_booking', id, { ..._data, id })
      const classQuery = query(getCollection('class'), where('id', '==', router.query.id as string))
      const docs = await getDocs(classQuery)
      if (!docs.empty) {
        const classData = docs.docs[0].data() as IClass
        await updateCollectionData('class', classData.id, { ...classData, daily_booking_ids: [...classData.daily_booking_ids, id] })
      }
      refetch()
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
  }, [modalOpen])

  useEffect(() => {
    fetchBookInfos()
  }, [data])

  if (!data) {
    return (
      <div className={'flex flex-col items-center gap-5 pt-10'}>
        <span className={'text-2xl font-bold'}>해당 날짜에는 아직까지 아무런 데이터가 없습니다.</span>
        <button onClick={createNewDailiyBooking} className={'rounded-md bg-zinc-500 p-2 px-5 text-lg text-white'}>
          생성하기
        </button>
      </div>
    )
  }
  return (
    <>
      <div>
        <button
          onClick={() => setModalOpen(true)}
          className={'flex w-full items-center justify-center gap-1 bg-rose-500 p-3 text-lg font-bold text-white'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
          <span>생성하기</span>
        </button>
        <ul>
          <div className="grid grid-cols-6 place-items-center bg-zinc-800 p-3 text-white">
            <span>이름</span>
            <span>과목</span>
            <span>출석 여부</span>
            <span>태도 점수</span>
            <span>과제 점수</span>
            <span>테스트 점수</span>
          </div>
          {bookInfos
            .sort((a, b) => {
              if (a.student.id === b.student.id) {
                return 0
              } else {
                return -1
              }
            })
            .map(item => (
              <DailyBookingItem key={item.id} data={item} />
            ))}
        </ul>
      </div>
      {modalOpen && <AddBookInfoModal refetch={refetch} bookingId={data.id} modalOpen={modalOpen} setModalOpen={setModalOpen} />}
    </>
  )
}

export default ClassDailyBooking
