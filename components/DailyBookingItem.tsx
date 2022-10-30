import { IBookInfo } from '../types/firebase'

interface IProps {
  data: IBookInfo
}

const DailyBookingItem = ({ data }: IProps) => {
  return (
    <div className="grid w-full grid-cols-6 place-items-center p-3 odd:bg-zinc-300 even:bg-zinc-100">
      <span>{data?.student.name}</span>
      <span>{data?.type}</span>
      <span>{data?.is_attend ? '출석' : '결석'}</span>
      <span>{data?.attitude_score}</span>
      <span>{data?.homework_score}</span>
      <span>{data?.test_score}</span>
    </div>
  )
}

export default DailyBookingItem
