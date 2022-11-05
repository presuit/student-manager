/* eslint-disable react/prop-types */
import { getDocs, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { IStudent, IStudentParent, IStudentSchool } from '../types/firebase'
import { createCollectionData, getCollection, updateCollectionData } from '../utils/firebase'
import StudentSelect from './StudentSelect'

interface IForm {
  name: string
  birthDate: string
  phoneNumber: string
  address: string
  schoolName: string
  schoolGrade: number
  schoolClass: number
  parentName: string
  parentJob: string
  parentPhoneNumber: string
  parentName2: string
  parentJob2: string
  parentPhoneNumber2: string
  isAcademian: string
}

interface IProps {
  classId: string
}

const ClassAddStudentModal: React.FC<IProps> = ({ classId }) => {
  const [open, setOpen] = useState(false)
  const { register, handleSubmit, reset } = useForm<IForm>()

  const onSubmit = async (data: IForm) => {
    const _dataSchool: IStudentSchool = {
      name: data.schoolName,
      class: +data.schoolClass,
      grade: +data.schoolGrade,
    }
    const _dataParent: IStudentParent = {
      name: data.parentName,
      job: data.parentJob,
      phone_number: data.parentPhoneNumber,
    }
    const _dataParent2: IStudentParent = {
      name: data.parentName2,
      job: data.parentJob2,
      phone_number: data.parentPhoneNumber2,
    }

    const _data: IStudent = {
      address: data.address,
      birth_date: data.birthDate,
      class_ids: [classId],
      created_at: new Date().toISOString(),
      id: '',
      is_academian: data.isAcademian === 'true' ? true : false,
      name: data.name,
      parent: [_dataParent, _dataParent2],
      phone_number: data.phoneNumber,
      prev_semester_score: 0,
      school: _dataSchool,
      updated_at: new Date().toISOString(),
    }

    const classQuery = query(getCollection('class'), where('id', '==', classId))
    try {
      const classQueryResult = await getDocs(classQuery)
      if (!classQueryResult.empty) {
        const originalClass = classQueryResult.docs[0].data()
        const studentResponse = await createCollectionData('student', _data)
        await updateCollectionData('student', studentResponse.id, { ..._data, id: studentResponse.id })
        await updateCollectionData('class', classId, { ...originalClass, student_ids: [...originalClass.student_ids, studentResponse.id] })
      }
    } catch (error) {
      console.log(error)
    }

    setOpen(false)
  }

  useEffect(() => {
    reset()
    if (open) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])
  return (
    <aside className="fixed bottom-0 right-0">
      <button
        onClick={() => setOpen(true)}
        className="m-5 rounded-full bg-zinc-800 p-3 ring ring-zinc-800 transition-all duration-300 hover:ring-offset-4"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 fill-zinc-100">
          <path d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z" />
        </svg>
      </button>
      {open && (
        <div className="fixed top-0 left-0 flex h-screen w-full items-center justify-center">
          <div onClick={() => setOpen(false)} className="h-full w-full cursor-pointer bg-black bg-opacity-50 backdrop-blur-sm" />
          <div className="absolute flex w-full max-w-screen-lg gap-5 rounded-md bg-zinc-100 p-5">
            <section className="h-[80vh] w-full flex-1 space-y-3 overflow-auto rounded-md bg-zinc-200 p-5">
              <h2 className="text-2xl font-bold">직접 입력</h2>
              <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-5">
                <label className="flex w-full flex-col gap-1">
                  <span className="text-zinc-500">이름</span>
                  <input
                    required
                    {...register('name', { required: true })}
                    type={'text'}
                    className="w-full rounded-md border border-zinc-300 bg-zinc-100 p-3 outline-none focus:border-rose-500"
                  />
                </label>
                <label className="flex w-full flex-col gap-1">
                  <span className="text-zinc-500">생년월일</span>
                  <input
                    required
                    {...register('birthDate', { required: true })}
                    type={'date'}
                    className="w-full rounded-md border border-zinc-300 bg-zinc-100 p-3 outline-none focus:border-rose-500"
                  />
                </label>
                <label className="flex w-full flex-col gap-1">
                  <span className="text-zinc-500">핸드폰 번호</span>
                  <input
                    required
                    type={'text'}
                    {...register('phoneNumber', { required: true })}
                    className="w-full rounded-md border border-zinc-300 bg-zinc-100 p-3 outline-none focus:border-rose-500"
                  />
                </label>
                <label className="flex w-full flex-col gap-1">
                  <span className="text-zinc-500">주소</span>
                  <input
                    required
                    type={'text'}
                    {...register('address', { required: true })}
                    className="w-full rounded-md border border-zinc-300 bg-zinc-100 p-3 outline-none focus:border-rose-500"
                  />
                </label>
                <div className="flex w-full gap-3">
                  <label className="flex w-full flex-1 flex-col gap-1">
                    <span className="text-zinc-500">학교 이름</span>
                    <input
                      required
                      type={'text'}
                      {...register('schoolName', { required: true })}
                      className="w-full rounded-md border border-zinc-300 bg-zinc-100 p-3 outline-none focus:border-rose-500"
                    />
                  </label>
                  <label className="flex w-full flex-1 flex-col gap-1">
                    <span className="text-zinc-500">학년</span>
                    <input
                      required
                      {...register('schoolGrade', { required: true, min: 1 })}
                      type={'number'}
                      min={1}
                      defaultValue={1}
                      className="w-full rounded-md border border-zinc-300 bg-zinc-100 p-3 outline-none focus:border-rose-500"
                    />
                  </label>
                  <label className="flex w-full flex-1 flex-col gap-1">
                    <span className="text-zinc-500">반</span>
                    <input
                      required
                      {...register('schoolClass', { required: true, min: 1 })}
                      min={1}
                      defaultValue={1}
                      type={'number'}
                      className="w-full rounded-md border border-zinc-300 bg-zinc-100 p-3 outline-none focus:border-rose-500"
                    />
                  </label>
                </div>
                <div className="flex w-full gap-3">
                  <label className="flex w-full flex-1 flex-col gap-1">
                    <span className="text-zinc-500">부모님 성함</span>
                    <input
                      required
                      type={'text'}
                      {...register('parentName', { required: true })}
                      className="w-full rounded-md border border-zinc-300 bg-zinc-100 p-3 outline-none focus:border-rose-500"
                    />
                  </label>
                  <label className="flex w-full flex-1 flex-col gap-1">
                    <span className="text-zinc-500">부모님 직업</span>
                    <input
                      required
                      type={'text'}
                      {...register('parentJob', { required: true })}
                      className="w-full rounded-md border border-zinc-300 bg-zinc-100 p-3 outline-none focus:border-rose-500"
                    />
                  </label>
                  <label className="flex w-full flex-1 flex-col gap-1">
                    <span className="text-zinc-500">부모님 전화번호</span>
                    <input
                      required
                      type={'text'}
                      {...register('parentPhoneNumber', { required: true, min: 1 })}
                      className="w-full rounded-md border border-zinc-300 bg-zinc-100 p-3 outline-none focus:border-rose-500"
                    />
                  </label>
                </div>
                <div className="flex w-full gap-3">
                  <label className="flex w-full flex-1 flex-col gap-1">
                    <span className="text-zinc-500">부모님 성함</span>
                    <input
                      required
                      type={'text'}
                      {...register('parentName2', { required: true })}
                      className="w-full rounded-md border border-zinc-300 bg-zinc-100 p-3 outline-none focus:border-rose-500"
                    />
                  </label>
                  <label className="flex w-full flex-1 flex-col gap-1">
                    <span className="text-zinc-500">부모님 직업</span>
                    <input
                      required
                      type={'text'}
                      {...register('parentJob2', { required: true })}
                      className="w-full rounded-md border border-zinc-300 bg-zinc-100 p-3 outline-none focus:border-rose-500"
                    />
                  </label>
                  <label className="flex w-full flex-1 flex-col gap-1">
                    <span className="text-zinc-500">부모님 전화번호</span>
                    <input
                      required
                      type={'text'}
                      {...register('parentPhoneNumber2', { required: true, min: 1 })}
                      className="w-full rounded-md border border-zinc-300 bg-zinc-100 p-3 outline-none focus:border-rose-500"
                    />
                  </label>
                </div>

                <div className="flex w-full flex-col gap-1">
                  <span className="text-zinc-500">재학생 여부</span>
                  <div className="flex w-full justify-center gap-10">
                    <label className="flex gap-1">
                      <span className="whitespace-nowrap">예</span>
                      <input
                        required
                        type={'radio'}
                        {...register('isAcademian', { required: true, min: 1 })}
                        id={'academianRadio'}
                        value={'true'}
                        className="w-4 rounded-md border border-zinc-300 bg-zinc-100 p-3 outline-none focus:border-rose-500"
                      />
                    </label>
                    <label className="flex gap-1">
                      <span className="whitespace-nowrap">아니요</span>
                      <input
                        required
                        type={'radio'}
                        {...register('isAcademian', { required: true, min: 1 })}
                        id={'academianRadio'}
                        value={'false'}
                        className="w-4 rounded-md border border-zinc-300 bg-zinc-100 p-3 outline-none focus:border-rose-500"
                      />
                    </label>
                  </div>
                </div>
                <div className="h-[1px] w-full border-t-4 border-dashed bg-zinc-400" />
                <input type={'submit'} value={'생성하기'} className={'w-full cursor-pointer rounded-md bg-rose-500 p-3 text-white'} />
              </form>
            </section>
            {/* <section className="max-w-[200px] overflow-auto rounded-md bg-zinc-200 p-5">
              <h2 className="pb-3 text-2xl font-bold">학생 선택</h2>
              <StudentSelect setOpen={setOpen} classId={classId} />
            </section> */}
          </div>
        </div>
      )}
    </aside>
  )
}

export default ClassAddStudentModal
