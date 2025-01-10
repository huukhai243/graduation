import PaymentServices, { PaymentKey } from '@/services/paymentServices'
import { PaymentParking } from '@/types/paymentType'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formattedDate } from '@/utils/utils'
import PaymentTypeEnum from '@/constants/payments/PaymentTypeEnum'
import { Button } from '@/components/ui/button'
import { alertErrorAxios } from '@/utils/alert'
import { toast } from 'react-toastify'
import ParkingTypeEnum from '@/constants/payments/ParkingTypeEnum'

const PaymentParkings = () => {
  const { monthId } = useParams()
  const queryClient = useQueryClient()
  const { data: paymentResponse, isSuccess } = useQuery({
    queryKey: [PaymentKey, 'parkings', monthId],
    queryFn: () => PaymentServices.parkings(monthId!),
    refetchOnMount: true,
  })

  const handleActive = async (paymentId: number) => {
    try {
      const response = await PaymentServices.activeParking(paymentId)
      toast.success(response.data.message)
      queryClient.refetchQueries({
        queryKey: [PaymentKey, 'parkings', monthId],
      })
    } catch (error) {
      alertErrorAxios(error)
    }
  }

  const handleCreate = async () => {
    try {
      const response = await PaymentServices.createParking({
        monthId: monthId!,
      })
      toast.success(response.data.message)
      queryClient.refetchQueries({
        queryKey: [PaymentKey, 'parkings', monthId],
      })
    } catch (error) {
      alertErrorAxios(error)
    }
  }

  const payments: PaymentParking[] = paymentResponse?.data
  return (
    <div>
      <Button
        className="float-right p-2 px-4 border rounded"
        onClick={handleCreate}
      >
        Thêm thanh toán giữ xe
      </Button>
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Tên</TableHead>
            <TableHead>Loại xe</TableHead>
            <TableHead>Số tiền</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Ngày thanh toán</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isSuccess &&
            payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">
                  {payment.User.Name}
                </TableCell>
                <TableCell>
                  {ParkingTypeEnum.getNameByValue(payment.ParkingType)}
                </TableCell>
                <TableCell>{payment.amount}</TableCell>
                <TableCell>
                  {PaymentTypeEnum.getNameByValue(payment.paymentstatus)}
                </TableCell>
                <TableCell>
                  {payment.paymentdate
                    ? formattedDate(payment.paymentdate)
                    : ''}
                </TableCell>
                {payment.paymentstatus === PaymentTypeEnum.UN_ACTIVE && (
                  <TableCell>
                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        onClick={() => handleActive(payment.id)}
                      >
                        xác nhận thanh toán
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default PaymentParkings
