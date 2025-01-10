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
import useQueryParams from '@/hooks/useQueryParams'
import { toast } from 'react-toastify'
import { alertErrorAxios } from '@/utils/alert'
import ChangeRoomServices, { ChangeRoomKey } from '@/services/changeRoomService'
import { ChangeRoom } from '@/types/changeRoomType'

const ChangeRoomsPage = () => {
  const queryParams = useQueryParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: changeRoomResponse, isSuccess } = useQuery({
    queryKey: [ChangeRoomKey, queryParams],
    queryFn: () => ChangeRoomServices.all(queryParams),
  })

  const changeRooms: ChangeRoom[] = changeRoomResponse?.data

  const activeRegister = async (registrationId: number) => {
    try {
      await ChangeRoomServices.active(registrationId)
      toast.success('duyệt đơn đổi phòng thành công')
      queryClient.invalidateQueries({
        queryKey: [ChangeRoomKey],
      })
    } catch (error) {
      alertErrorAxios(error)
    }
  }

  return (
    <div className="container">
      <h1 className="text-4xl font-bold capitalize my-5">
        Danh sách đơn đổi phòng
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
            <TableHead>Giới tính</TableHead>
            <TableHead>phòng cũ</TableHead>
            <TableHead>phòng mới</TableHead>
            <TableHead>lý do</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isSuccess &&
            changeRooms.map((roomUser) => (
              <TableRow key={roomUser.id}>
                <TableCell className="font-medium">
                  {roomUser.User.Name}
                </TableCell>
                <TableCell>{roomUser.User.Phone}</TableCell>
                <TableCell>{roomUser.User.Email}</TableCell>
                <TableCell>{roomUser.User.Gender}</TableCell>
                <TableCell>
                  {roomUser.oldRoom.Building.name} - {roomUser.oldRoom.name}
                </TableCell>
                <TableCell>
                  {roomUser.newRoom.Building.name} - {roomUser.newRoom.name}
                </TableCell>

                <TableCell>{roomUser.description}</TableCell>
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

export default ChangeRoomsPage
