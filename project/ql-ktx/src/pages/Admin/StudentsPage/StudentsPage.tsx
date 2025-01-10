import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { useQuery } from '@tanstack/react-query'
import RoomUserServices, { RoomUserKey } from '@/services/roomUserServices'
import { RoomUser } from '@/types/roomUserType'
import { formattedDate } from '@/utils/utils'

const StudentsPage = () => {
  const { data: userResponse, isSuccess } = useQuery({
    queryKey: [RoomUserKey, 'users'],
    queryFn: RoomUserServices.users,
  })

  const roomUsers: RoomUser[] = userResponse?.data

  return (
    <div className="container">
      <h1 className="text-4xl font-bold capitalize my-5">
        Danh sách sinh viên
      </h1>
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Tên</TableHead>
            <TableHead>Số điện thoại</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Giới tính</TableHead>
            <TableHead>phòng</TableHead>
            <TableHead>Ngày vào</TableHead>
            {/* <TableHead>hành động</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isSuccess &&
            roomUsers.map((roomUser) => (
              <TableRow key={roomUser.id}>
                <TableCell className="font-medium">
                  {roomUser.User.Name}
                </TableCell>
                <TableCell>{roomUser.User.Phone}</TableCell>
                <TableCell>{roomUser.User.Email}</TableCell>
                <TableCell>{roomUser.User.Gender}</TableCell>
                <TableCell>
                  {roomUser.Room.Building.name} - {roomUser.Room.name}
                </TableCell>
                <TableCell>{formattedDate(roomUser.dateIn)}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default StudentsPage
