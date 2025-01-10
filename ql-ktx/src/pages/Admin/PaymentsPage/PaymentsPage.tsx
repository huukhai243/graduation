import MonthServices, { MonthKey } from '@/services/monthServices'
import { Month } from '@/types/monthType'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

const PaymentsPage = () => {
  const { data: monthResponse, isSuccess } = useQuery({
    queryKey: [MonthKey],
    queryFn: MonthServices.all,
  })

  const months: Month[] = monthResponse?.data

  return (
    <div className="grid grid-cols-5 gap-16">
      {isSuccess &&
        months.map((month) => (
          <Link
            to={`/admin/payments/${month.id}`}
            className={`
              border flex justify-center items-center
              min-h-24 rounded-md`}
            key={month.id}
          >
            {month.time}
          </Link>
        ))}
    </div>
  )
}

export default PaymentsPage
