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
import { getRegistrationStatusName } from '@/utils/utils'
import { Registration } from '@/types/registrationType'
import RegistrationServices, {
  RegistrationKey,
} from '@/services/registrationServices'
import useQueryParams from '@/hooks/useQueryParams'
import { toast } from 'react-toastify'
import { alertErrorAxios } from '@/utils/alert'

const RegistrationsPage = () => {
  const queryParams = useQueryParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: registrationResponse, isSuccess } = useQuery({
    queryKey: [RegistrationKey, queryParams],
    queryFn: () => RegistrationServices.all(queryParams),
  })

  const registrations: Registration[] = registrationResponse?.data

  const activeRegister = async (registrationId: number) => {
    try {
      await RegistrationServices.active(registrationId)
      toast.success('duyệt đơn đăng ký thành công')
      queryClient.invalidateQueries({
        queryKey: [RegistrationKey],
      })
    } catch (error) {
      alertErrorAxios(error)
    }
  }

  return (
    <div className="container">
      <h1 className="text-4xl font-bold capitalize my-5">
        Danh sách đăng ký phòng
      </h1>

      <Select
        onValueChange={(value) => {
          console.log('chaneg')

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
            <TableHead>Giới tính</TableHead>
            <TableHead>phòng 1</TableHead>
            <TableHead>phòng 2</TableHead>
            <TableHead>phòng 3</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isSuccess &&
            registrations.map((roomUser) => (
              <TableRow key={roomUser.id}>
                <TableCell className="font-medium">
                  {roomUser.User.Name}
                </TableCell>
                <TableCell>{roomUser.User.Phone}</TableCell>
                <TableCell>{roomUser.User.Email}</TableCell>
                <TableCell>{roomUser.User.Gender}</TableCell>
                <TableCell
                  className={`${
                    roomUser.RoomActive === roomUser.RoomNumber1 &&
                    'font-bold bg-lime-400'
                  }`}
                >
                  {roomUser.Room1.Building.name} - {roomUser.Room1.name}
                </TableCell>
                <TableCell
                  className={`${
                    roomUser.RoomActive === roomUser.RoomNumber2 &&
                    'font-bold bg-lime-400'
                  }`}
                >
                  {roomUser.Room2.Building.name} - {roomUser.Room2.name}
                </TableCell>
                <TableCell
                  className={`${
                    roomUser.RoomActive === roomUser.RoomNumber3 &&
                    'font-bold bg-lime-400'
                  }`}
                >
                  {roomUser.Room3.Building.name} - {roomUser.Room3.name}
                </TableCell>
                <TableCell>
                  {getRegistrationStatusName(roomUser.registrationstatus)}
                </TableCell>
                <TableCell>
                  <div className="flex gap-4">
                    {roomUser.registrationstatus === '0' && (
                      <Button
                        variant="default"
                        onClick={() => {
                          activeRegister(roomUser.id)
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

export default RegistrationsPage
