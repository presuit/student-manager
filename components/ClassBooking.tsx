import dayjs from 'dayjs'
import { getDocs, query, where } from 'firebase/firestore'
import { SyntheticEvent, useEffect, useState } from 'react'
import { IDailyBooking, IStudent } from '../types/firebase'
import { getCollection } from '../utils/firebase'
import ClassDailyBooking from './ClassDailyBooking'
import ClassMonthlyReport from './ClassMonthlyReport'
import LoadingSpinner from './LoadingSpinner'

interface IProps {
  bookingIds: string[]
  students: IStudent[]
}

const ClassBooking = ({ bookingIds, students }: IProps) => {
  const [loading, setLoading] = useState(false)
  const [bookingDate, setBookingDate] = useState(dayjs())
  const [buttonOpen, setButtonOpen] = useState(false)
  const [dailyBookings, setDailiyBookings] = useState<IDailyBooking[]>([])

  const currentDateBooking = dailyBookings.find(item => item.date === bookingDate.format('YYYY-MM-DD'))

  const handleOnChange = (e: SyntheticEvent<HTMLInputElement>) => {
    e.preventDefault()
    const dateString = e.currentTarget.value
    setBookingDate(dayjs(dateString))
    setButtonOpen(false)
  }

  const fetchDailyBookings = async () => {
    setLoading(true)
    const promises = bookingIds.map(
      id =>
        new Promise(resolve => {
          const _query = query(getCollection('daily_booking'), where('id', '==', id))
          getDocs(_query).then(docs => {
            let result
            if (!docs.empty) {
              result = docs.docs[0].data() as IDailyBooking
            } else {
              result = null
            }
            resolve(result)
          })
        }),
    )
    const results = await Promise.all(promises)
    const filtered = results.filter(n => n) as IDailyBooking[]
    setDailiyBookings(filtered)
    setLoading(false)
  }

  useEffect(() => {
    fetchDailyBookings()
  }, [])

  return (
    <section className="flex-1 overflow-hidden rounded-md bg-zinc-200 shadow-md">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className={'flex w-full items-center justify-start gap-5 bg-zinc-300 p-3'}>
            <div className={'relative'}>
              <button onClick={() => setButtonOpen(prev => !prev)} className={'rounded-full bg-zinc-100 p-2'}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                  />
                </svg>
              </button>
              {buttonOpen && (
                <aside className={'absolute top-full left-0 pt-3'}>
                  <input onChange={handleOnChange} type={'date'} className={'cursor-pointer rounded-md p-2 text-lg'} />
                </aside>
              )}
            </div>
            <span className={'text-lg font-medium'}>{bookingDate.format('YY.MM.DD')}</span>
          </div>
          <ClassDailyBooking refetch={fetchDailyBookings} currentDate={bookingDate.format('YYYY-MM-DD')} data={currentDateBooking} />
          <ClassMonthlyReport date={bookingDate} dailyBookings={dailyBookings} students={students} />
        </>
      )}
    </section>
  )
}

export default ClassBooking
