import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { UserContext } from '../Providers/UserProvider'
import { IClass } from '../types/firebase'
import { createCollectionData, updateCollectionData } from '../utils/firebase'

interface IForm {
  name: string
}

const AddClassModal = () => {
  const { user } = useContext(UserContext)
  const [open, setOpen] = useState(false)
  const { register, handleSubmit, reset } = useForm<IForm>()
  const onSubmit = async ({ name }: IForm) => {
    if (!user) return
    try {
      const _data: IClass = {
        id: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        daily_booking_ids: [],
        name,
        student_ids: [],
        teacher_id: user.uid,
      }
      const response = await createCollectionData('class', _data)
      await updateCollectionData('class', response.id, { ..._data, id: response.id })
    } catch (error) {
      alert(error)
      console.log(error)
    } finally {
      setOpen(false)
    }
  }

  useEffect(() => {
    reset()
  }, [open])

  return (
    <aside className="fixed bottom-0 right-0">
      <button
        onClick={() => setOpen(true)}
        className="m-5 flex items-center justify-center gap-3 rounded-full bg-rose-500 p-3 ring ring-rose-500 transition-all duration-300 hover:ring-offset-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-8 w-8 stroke-white"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
      {open && (
        <div className="fixed top-0 left-0 flex h-screen w-full items-center justify-center">
          <div onClick={() => setOpen(false)} className="h-full w-full cursor-pointer bg-black bg-opacity-50 backdrop-blur-sm" />
          <div className="absolute w-full max-w-screen-sm rounded-md bg-white">
            <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} className="flex h-full w-full flex-col items-center justify-start gap-5 p-10">
              <input
                {...register('name', { required: true })}
                required
                placeholder="클래스 닉네임"
                className="w-full rounded-md border border-zinc-300 p-3 text-lg outline-none focus:border-rose-500"
              />
              <input
                type={'submit'}
                value={'클래스 생성'}
                className={
                  'mt-auto w-full cursor-pointer rounded-md bg-zinc-300 p-3 font-medium transition-colors duration-300 hover:bg-rose-500 hover:text-white'
                }
              />
            </form>
          </div>
        </div>
      )}
    </aside>
  )
}

export default AddClassModal
