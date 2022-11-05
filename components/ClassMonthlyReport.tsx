import dayjs, { Dayjs } from 'dayjs'
import { getDocs, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { IBookInfo, IDailyBooking, IStudent } from '../types/firebase'
import { getCollection } from '../utils/firebase'
import LoadingSpinner from './LoadingSpinner'

interface IProps {
  students: IStudent[]
  date: Dayjs
  dailyBookings: IDailyBooking[]
}
interface IMonthData {
  bookInfo: IBookInfo
  date: string
}

const ClassMonthlyReport = ({ students, date, dailyBookings }: IProps) => {
  const [open, setOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<IStudent>()
  const [monthBooks, setMonthBooks] = useState<IMonthData[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedStudentMonthBooks, setSelectedStudentMonthBooks] = useState<Record<number, IMonthData[]>>()

  const fetchStudentMonthData = async () => {
    if (selectedStudent) {
      const container: IMonthData[] = []
      const filteredBookings = dailyBookings.filter(item => dayjs(item.date).isSame(dayjs(date), 'month'))
      for (const booking of filteredBookings) {
        for (const bookInfoId of booking.book_info_ids) {
          const _query = query(getCollection('book_info'), where('id', '==', bookInfoId))
          const bookInfoData = (await getDocs(_query)).docs[0]?.data() as IBookInfo
          if (bookInfoData && bookInfoData.student.id === selectedStudent.id) {
            container.push({ bookInfo: bookInfoData, date: booking.date })
          }
        }
      }
      setMonthBooks([...container])
    }
  }

  const getSelectedStudentMonthBooks = () => {
    const container: Record<number, IMonthData[]> = {}
    for (let i = 1; i <= dayjs(date).daysInMonth(); i++) {
      const exists = monthBooks.filter(item => {
        const itemDate = dayjs(item.date)
        const targetDate = dayjs(itemDate).set('date', i)
        return itemDate.isSame(targetDate, 'date')
      })
      if (exists.length > 0) {
        console.log('exists!')
        for (const item of exists) {
          if (container[i]) {
            container[i].push(item)
          } else {
            container[i] = [item]
          }
        }
      } else {
        container[i] = []
      }
    }
    setSelectedStudentMonthBooks({ ...container })
  }

  const getAvg = (type: 'attend' | 'homework' | 'attitude' | 'testScore', record: Record<number, IMonthData[]>) => {
    let result = 0
    let count = 0

    for (const key of Object.keys(record)) {
      const data = record[+key]
      if (data.length > 0) {
        for (const dataItem of data) {
          count += 1
          switch (type) {
            case 'attend':
              result += dataItem.bookInfo.is_attend ? 1 : 0
              break
            case 'attitude':
              result += +dataItem.bookInfo.attitude_score
              break
            case 'homework':
              result += +dataItem.bookInfo.homework_score
              break
            case 'testScore':
              result += +dataItem.bookInfo.test_score
              break
          }
        }
      }
    }

    const endofValue = Math.round(result / count)
    return isNaN(endofValue) ? 0 : endofValue
  }

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    setLoading(true)
    if (selectedStudent) {
      fetchStudentMonthData()
    }
  }, [selectedStudent])

  useEffect(() => {
    getSelectedStudentMonthBooks()
    setLoading(false)
  }, [monthBooks])

  console.log(monthBooks)

  return (
    <>
      <div className={'fixed bottom-0 right-0 mb-5 mr-24'}>
        <button onClick={() => setOpen(true)} className={'rounded-full bg-black p-3 ring-black ring-offset-4 transition-all duration-300 hover:ring'}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-8 w-8 stroke-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
            />
          </svg>
        </button>
      </div>
      {open && (
        <aside className="fixed top-0 left-0 z-10 h-screen w-full">
          <div onClick={() => setOpen(false)} className="h-full w-full cursor-pointer bg-black bg-opacity-50" />
          <main className="absolute top-1/2 left-1/2 flex w-full max-w-screen-2xl -translate-y-1/2 -translate-x-1/2 flex-col gap-5">
            <div className={'flex w-full gap-5 overflow-auto rounded-md p-5 pl-0'}>
              {[...students].map(student => (
                <div
                  onClick={() => setSelectedStudent({ ...student })}
                  className={`shrink-0 cursor-pointer rounded-md bg-white p-3 text-2xl ${
                    student.id === selectedStudent?.id ? 'font-bold text-teal-500' : 'font-medium text-black'
                  }`}
                  key={student.id}
                >
                  {student.name}
                </div>
              ))}
            </div>
            <div className="flex h-[80vh] w-full flex-col overflow-auto rounded-md bg-white">
              {loading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <div className={'w-full border-b border-zinc-300 bg-zinc-100 p-5 text-2xl font-bold text-black'}>
                    {date.format('YYYY[년] MM[월]')} <strong className={'text-teal-500'}>{selectedStudent?.name}</strong>
                  </div>
                  <div className="flex w-full flex-1">
                    <div className="grid shrink-0 grid-rows-6 place-items-center bg-white p-3">
                      <div></div>
                      <div>과목명</div>
                      <div>출결</div>
                      <div>과제</div>
                      <div>수업태도</div>
                      <div>테스트 점수</div>
                    </div>
                    {selectedStudentMonthBooks
                      ? Object.keys(selectedStudentMonthBooks).map(key => {
                          if (selectedStudentMonthBooks[+key].length > 0) {
                            return selectedStudentMonthBooks[+key].map(item => (
                              <div
                                key={item.bookInfo.id}
                                className="grid flex-1 grid-rows-6 place-items-center whitespace-nowrap p-3 odd:bg-zinc-100 even:bg-zinc-200"
                              >
                                <div>{key}</div>
                                <div>{item.bookInfo.type}</div>
                                <div>{item.bookInfo.is_attend ? '출석' : '결석'}</div>
                                <div>{item.bookInfo.homework_score}</div>
                                <div>{item.bookInfo.attitude_score}</div>
                                <div>{item.bookInfo.test_score}</div>
                              </div>
                            ))
                          } else {
                            return (
                              <div
                                key={key}
                                className="grid flex-1 grid-rows-6 place-items-center whitespace-nowrap p-3 odd:bg-zinc-100 even:bg-zinc-200"
                              >
                                <div>{key}</div>
                                <div>-</div>
                                <div>-</div>
                                <div>-</div>
                                <div>-</div>
                                <div>-</div>
                              </div>
                            )
                          }
                        })
                      : Array.from({ length: dayjs(date).daysInMonth() }).map((_, i) => (
                          <div
                            key={i}
                            className="grid flex-1 shrink-0 grid-rows-6 place-items-center whitespace-nowrap p-3 odd:bg-zinc-100 even:bg-zinc-200"
                          >
                            <div>{i + 1}</div>
                            <div>-</div>
                            <div>-</div>
                            <div>-</div>
                            <div>-</div>
                            <div>-</div>
                          </div>
                        ))}
                    {selectedStudentMonthBooks ? (
                      <div className="grid shrink-0 grid-rows-6 place-items-center whitespace-nowrap  bg-teal-500 p-3 px-5 text-white">
                        <div>평균</div>
                        <div></div>
                        <div>{getAvg('attend', selectedStudentMonthBooks)}</div>
                        <div>{getAvg('homework', selectedStudentMonthBooks)}</div>
                        <div>{getAvg('attitude', selectedStudentMonthBooks)}</div>
                        <div>{getAvg('testScore', selectedStudentMonthBooks)}</div>
                      </div>
                    ) : (
                      <div className="grid shrink-0 grid-rows-6 place-items-center whitespace-nowrap bg-teal-500 p-3 px-5 text-white">
                        <div>평균</div>
                        <div>-</div>
                        <div>-</div>
                        <div>-</div>
                        <div>-</div>
                        <div>-</div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </main>
        </aside>
      )}
    </>
  )
}

export default ClassMonthlyReport
