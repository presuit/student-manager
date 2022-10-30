import { getDocs, query, where } from 'firebase/firestore'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { IClass, IStudent } from '../types/firebase'
import { getCollection, getCollectionData, updateCollectionData } from '../utils/firebase'

interface IProps {
  classId: string
  setOpen: Dispatch<SetStateAction<boolean>>
}

const StudentSelect = ({ classId, setOpen }: IProps) => {
  const [students, setStudents] = useState<IStudent[]>([])
  const fetchStudents = async () => {
    try {
      const container: IStudent[] = []
      const { docs } = await getCollectionData('student')
      for (const docItem of docs) {
        if (docItem.exists()) {
          container.push(docItem.data() as IStudent)
        }
      }
      setStudents(container)
    } catch (error) {
      console.log(error)
      setStudents([])
    }
  }
  const handleClickToSelectStudent = async (id: string) => {
    try {
      const classQuery = query(getCollection('class'), where('id', '==', classId))
      const queryResult = await getDocs(classQuery)
      if (!queryResult.empty) {
        const classData = queryResult.docs[0].data() as IClass
        const duplicateCheck = classData.student_ids.includes(id) ?? false
        if (!duplicateCheck) {
          await updateCollectionData('class', classData.id, { ...classData, student_ids: [...classData.student_ids, id] })
          // update here
          const studentQuery = query(getCollection('student'), where('id', '==', id))
          const studentDocs = await getDocs(studentQuery)
          if (!studentDocs.empty) {
            const studentData = studentDocs.docs[0].data() as IStudent
            await updateCollectionData('student', studentData.id, { ...studentData, class_ids: [...studentData.class_ids, classData.id] })
          }
          setOpen(false)
        } else {
          alert('이미 클래스에 존재하는 학생입니다.')
        }
      }
    } catch (error) {
      alert('학생 선택 오류 다시 선택해 주세요.')
      console.log(error)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])
  return (
    <div className="w-full space-y-3 border-t border-zinc-300 pt-3">
      {students.map(data => (
        <button
          onClick={() => handleClickToSelectStudent(data.id)}
          className="w-full break-words rounded-md bg-zinc-100 text-lg font-medium"
          key={data.id}
        >
          {data.name}
        </button>
      ))}
    </div>
  )
}

export default StudentSelect
