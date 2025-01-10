import PaymentServices, { PaymentKey } from '@/services/paymentServices'
import { PaymentRoom } from '@/types/paymentType'
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

const PaymentRooms = () => {
  const { monthId } = useParams()
  const queryClient = useQueryClient()
  const { data: paymentResponse, isSuccess } = useQuery({
    queryKey: [PaymentKey, 'rooms', monthId],
    queryFn: () => PaymentServices.rooms(monthId!),
    refetchOnMount: true,
  })

  const handleActive = async (paymentId: number) => {
    try {
      const response = await PaymentServices.activeRoom(paymentId)
      toast.success(response.data.message)
      queryClient.refetchQueries({
        queryKey: [PaymentKey, 'rooms', monthId],
      })
    } catch (error) {
      alertErrorAxios(error)
    }
  }

  const handleCreate = async () => {
    try {
      const response = await PaymentServices.createRoom({ monthId: monthId! })
      toast.success(response.data.message)
      queryClient.refetchQueries({
        queryKey: [PaymentKey, 'rooms', monthId],
      })
    } catch (error) {
      alertErrorAxios(error)
    }
  }

  const payments: PaymentRoom[] = paymentResponse?.data
  return (
    <div>
      <Button
        className="float-right p-2 px-4 border rounded"
        onClick={handleCreate}
      >
        Thêm thanh toán phòng
      </Button>
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Tên</TableHead>
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

export default PaymentRooms
