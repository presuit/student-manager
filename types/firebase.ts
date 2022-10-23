type TId = string
export type TFBCollection = 'user' | 'student' | 'class' | 'daily_booking' | 'book_info'

interface ICommon {
  id: TId
  created_at: string
  updated_at: string
}

export interface IUser extends ICommon {
  googleUid: TId
  email: string
  name: string
  class_ids: TId[]
}

export interface IStudentSchool {
  name: string
  grade: number
  class: number
}

export interface IStudentParent {
  name: string
  job: string
  phone_number: string
}

export interface IStudent extends ICommon {
  name: string
  birth_date: string
  phone_number: string
  address: string
  school: IStudentSchool
  parent: IStudentParent
  prev_semester_score: number
  is_academian: boolean
  class_ids: TId[]
}

export interface IClass extends ICommon {
  name: string
  teacher_id: TId
  student_ids: TId[]
  daily_booking_ids: TId[]
}

export interface IDailyBooking extends ICommon {
  class_id: TId
  date: string
  book_info_ids: TId[]
}

export interface IBookInfoStudent {
  id: TId
  name: string
}

export interface IBookInfoHomework {
  total: number
  current: number
}

export interface IBookInfo extends ICommon {
  daily_booking_id: TId
  student: IBookInfoStudent
  is_attend: boolean
  attitude_score: number
  test_score: number
  homework: IBookInfoHomework
}
