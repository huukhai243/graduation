import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getParkingTypeName, getRegistrationStatusName } from '@/utils/utils'
import useQueryParams from '@/hooks/useQueryParams'
import { toast } from 'react-toastify'
import { alertErrorAxios } from '@/utils/alert'
import RegistrationParkingServices, {
  RegistrationParkingKey,
} from '@/services/registrationParkingServices'
import { RegistrationParking } from '@/types/registrationParkingType'

const RegistrationParkingsPage = () => {
  const queryParams = useQueryParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: registrationParkingResponse, isSuccess } = useQuery({
    queryKey: [RegistrationParkingKey, queryParams],
    queryFn: () => RegistrationParkingServices.all(queryParams),
  })

  const registrationParkings: RegistrationParking[] =
    registrationParkingResponse?.data

  const activeRegister = async (registrationId: number) => {
    try {
      await RegistrationParkingServices.active(registrationId)
      toast.success('duyệt đơn đăng ký thành công')
      queryClient.invalidateQueries({
        queryKey: [RegistrationParkingKey],
      })
    } catch (error) {
      alertErrorAxios(error)
    }
  }

  return (
    <div className="container">
      <h1 className="text-4xl font-bold capitalize my-5">
        Danh sách đăng ký gửi xe
      </h1>

      <Select
        onValueChange={(value) => {
          navigate(`?status=${value.trim()}`)
        }}
        value={queryParams.status ?? ' '}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Tất cả" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value=" ">Tất cả</SelectItem>
          <SelectItem value="0">Chờ duyệt</SelectItem>
          <SelectItem value="1">Được duyệt</SelectItem>
          <SelectItem value="2">Không được duyệt</SelectItem>
        </SelectContent>
      </Select>

      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Tên</TableHead>
            <TableHead>Số điện thoại</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>biển số xe(nếu có)</TableHead>
            <TableHead>loại xe</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isSuccess &&
            registrationParkings.map((registration) => (
              <TableRow key={registration.id}>
                <TableCell className="font-medium">
                  {registration.User.Name}
                </TableCell>
                <TableCell>{registration.User.Phone}</TableCell>
                <TableCell>{registration.User.Email}</TableCell>
                <TableCell>{registration.info}</TableCell>
                <TableCell>
                  {getParkingTypeName(registration.parkingType)}
                </TableCell>
                <TableCell>
                  {getRegistrationStatusName(registration.registrationstatus)}
                </TableCell>
                <TableCell>
                  <div className="flex gap-4">
                    {registration.registrationstatus === '0' && (
                      <Button
                        variant="default"
                        onClick={() => {
                          activeRegister(registration.id)
                        }}
                      >
                        Duyệt
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default RegistrationParkingsPage
