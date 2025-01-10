import PaymentServices, { PaymentKey } from '@/services/paymentServices'
import { PaymentService } from '@/types/paymentType'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
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

const PaymentServicesComp = () => {
  const { monthId } = useParams()
  const queryClient = useQueryClient()
  const { data: paymentResponse, isSuccess } = useQuery({
    queryKey: [PaymentKey, 'services', monthId],
    queryFn: () => PaymentServices.services(monthId!),
    refetchOnMount: true,
  })

  const handleActive = async (paymentId: number) => {
    try {
      const response = await PaymentServices.activeService(paymentId)
      toast.success(response.data.message)
      queryClient.refetchQueries({
        queryKey: [PaymentKey, 'services', monthId],
      })
    } catch (error) {
      alertErrorAxios(error)
    }
  }

  const payments: PaymentService[] = paymentResponse?.data
  return (
    <div>
      <Link
        to={'create-payment-service'}
        className="float-right p-2 px-4 border rounded"
      >
        Thêm thanh toán dịch vụ
      </Link>
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Phòng</TableHead>
            <TableHead>Số điện</TableHead>
            <TableHead>Giá điện</TableHead>
            <TableHead>Số nước</TableHead>
            <TableHead>Giá nước</TableHead>
            <TableHead>Tổng</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Ngày thanh toán</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isSuccess &&
            payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">
                  {payment.Room.Building.name} - {payment.Room.name}
                </TableCell>
                <TableCell>{payment.electric}</TableCell>
                <TableCell>{payment.electricPrice}</TableCell>
                <TableCell>{payment.water}</TableCell>
                <TableCell>{payment.waterPrice}</TableCell>
                <TableCell>{payment.amount}</TableCell>
                <TableCell>
                  {PaymentTypeEnum.getNameByValue(payment.paymentstatus)}
                </TableCell>
                <TableCell>
                  {payment.Paymentdate
                    ? formattedDate(payment.Paymentdate)
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

export default PaymentServicesComp
