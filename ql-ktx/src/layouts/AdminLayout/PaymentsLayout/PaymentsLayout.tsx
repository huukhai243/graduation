import MonthServices, { MonthKey } from '@/services/monthServices'
import { Month } from '@/types/monthType'
import { useQuery } from '@tanstack/react-query'
import { Outlet, useParams } from 'react-router-dom'

const PaymentsLayout = () => {
  const { monthId } = useParams()

  const { data: monthResponse, isSuccess } = useQuery({
    queryKey: [MonthKey, 'get', monthId],
    queryFn: () => MonthServices.get(monthId ?? 'not/found'),
  })

  const month: Month = monthResponse?.data

  return (
    <div>
      <h1 className="text-4xl font-bold capitalize my-5">
        Quản lý thanh toán {isSuccess && <>tháng {month.time}</>}
      </h1>

      <Outlet />
    </div>
  )
}

export default PaymentsLayout
