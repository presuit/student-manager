import { getDocs, query, where } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { IBookInfo, IDailyBooking, IStudent } from '../types/firebase'
import { createCollectionData, getCollection, updateCollectionData } from '../utils/firebase'

interface IProps {
  setModalOpen: Dispatch<SetStateAction<boolean>>
  modalOpen: boolean
  bookingId: string
  refetch: () => void
}

interface IForm {
  type: string
  student: string
  attend: string
  attend_score: number
  test_score: number
  homework_score: number
}

const AddBookInfoModal = ({ setModalOpen, bookingId, refetch }: IProps) => {
  const router = useRouter()
  const { register, handleSubmit, reset } = useForm<IForm>()
  const [classStudents, setClassStudents] = useState<IStudent[]>([])

  const fetchClassStudents = async () => {
    const container: IStudent[] = []
    try {
      const _query = query(getCollection('student'), where('class_ids', 'array-contains', router.query.id as string))
      const response = await getDocs(_query)
      if (!response.empty) {
        response.forEach(doc => container.push(doc.data() as IStudent))
      }
    } catch (error) {
      console.log(error)
    } finally {
      setClassStudents(container)
    }
  }

  const onSubmit = async (data: IForm) => {
    try {
      const _data: IBookInfo = {
        attitude_score: data.attend_score,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        daily_booking_id: bookingId,
        homework_score: data.homework_score,
        id: '',
        is_attend: data.attend === 'true' ?? false,
        student: {
          id: data.student,
          name: classStudents.find(item => item.id === data.student)?.name ?? 'anon',
        },
        test_score: data.test_score,
        type: data.type,
      }
      const response = await createCollectionData('book_info', _data)
      await updateCollectionData('book_info', response.id, { ..._data, id: response.id })
      const dailyBookingQuery = query(getCollection('daily_booking'), where('id', '==', bookingId))
      const docs = await getDocs(dailyBookingQuery)
      if (!docs.empty) {
        const dailyBookingData = docs.docs[0].data() as IDailyBooking
        await updateCollectionData('daily_booking', dailyBookingData.id, {
          ...dailyBookingData,
          book_info_ids: [...dailyBookingData.book_info_ids, response.id],
        })
      }
      refetch()
    } catch (error) {
      console.log(error)
    } finally {
      setModalOpen(false)
    }
  }

  useEffect(() => {
    fetchClassStudents()
    return () => {
      reset()
    }
  }, [])

  return (
    <aside className={'fixed top-0 left-0 h-screen w-full'}>
      <div onClick={() => setModalOpen(false)} className={'h-full w-full cursor-pointer bg-black bg-opacity-50 backdrop-blur-sm'} />
      <main
        className={
          'absolute top-1/2 left-1/2 h-[70vh] w-full max-w-screen-sm -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-md bg-white p-5'
        }
      >
        <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} className={'flex w-full flex-col gap-5'}>
          <input
            required
            {...register('type', { required: true })}
            className={'w-full border border-zinc-300 p-3 outline-none'}
            type={'text'}
            placeholder={'과목'}
          />

          <div className={'w-full'}>
            <span className={'text-lg font-bold'}>학생 선택</span>
            <div className="flex w-full flex-wrap items-center gap-3">
              {classStudents.map(item => (
                <label className={'flex gap-1 rounded-md border border-zinc-300 p-3'} key={item.id}>
                  <input
                    required
                    {...register('student', { required: true })}
                    type={'radio'}
                    id={item.id}
                    name={'student'}
                    className={'rounded-md bg-zinc-100 p-3 font-medium'}
                    value={item.id}
                  />
                  <span>{item.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div className={'flex w-full flex-col'}>
            <span className="text-lg font-bold">출결</span>
            <div className={'flex gap-3'}>
              <label className={'flex gap-1 rounded-md border border-zinc-300 p-3'}>
                <input required {...register('attend', { required: true })} type={'radio'} id={'attend'} name={'attend'} value={'true'} />
                <span>출석</span>
              </label>
              <label className={'flex gap-1 rounded-md border border-zinc-300 p-3'}>
                <input required {...register('attend', { required: true })} type={'radio'} id={'attend'} name={'attend'} value={'false'} />
                <span>결석</span>
              </label>
            </div>
          </div>
          <input
            required
            min={0}
            max={5}
            {...register('attend_score', { required: true, min: 0, max: 5 })}
            className={'w-full rounded-md border border-zinc-300 p-3 outline-none'}
            type={'number'}
            placeholder={'수업 태도'}
          />
          <input
            required
            min={0}
            max={100}
            {...register('test_score', { required: true, min: 0, max: 100 })}
            className={'w-full rounded-md border border-zinc-300 p-3 outline-none'}
            type={'number'}
            placeholder={'테스트 점수'}
          />
          <input
            required
            min={0}
            max={100}
            {...register('homework_score', { required: true, min: 0, max: 100 })}
            className={'w-full rounded-md border border-zinc-300 p-3 outline-none'}
            type={'number'}
            placeholder={'과제 점수'}
          />
          <input className={'w-full cursor-pointer rounded-md bg-rose-500 p-3 font-medium text-white'} type={'submit'} value={'생성하기'} />
        </form>
      </main>
    </aside>
  )
}

export default AddBookInfoModal
