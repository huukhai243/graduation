import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Building } from '@/types/buildingType'
import BuildingServices, { BuildingKey } from '@/services/buildingServices'
import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { toast } from 'react-toastify'
import { alertErrorAxios } from '@/utils/alert'
import RoomServices, { RoomKey } from '@/services/roomServices'
import { RoomWithRoomUser } from '@/types/roomType'
import UserGenderEnum from '@/constants/users/UserGenderEnum'

const RoomsPage = () => {
  const { buildingId } = useParams()
  const buildingQuery = useQuery({
    queryKey: [BuildingKey, 'get', buildingId],
    queryFn: () => BuildingServices.get(buildingId!),
  })

  const roomQuery = useQuery({
    queryKey: [RoomKey, 'building', buildingId],
    queryFn: () => BuildingServices.rooms(buildingId!),
  })

  const building: Building = buildingQuery.data?.data
  const rooms: RoomWithRoomUser[] = roomQuery.data?.data

  const queryClient = useQueryClient()

  const handleDeleteRoom = async (id: number) => {
    try {
      await RoomServices.delete(id)
      toast.success('Xóa phòng thành công')
      queryClient.invalidateQueries({
        queryKey: [BuildingKey],
      })
      queryClient.invalidateQueries({
        queryKey: [RoomKey],
      })
    } catch (error) {
      alertErrorAxios(error)
    }
  }

  return (
    <div className="container">
      <h1 className="text-4xl font-bold capitalize my-5">
        Danh sách phòng của tòa nhà {buildingQuery.isSuccess && building.name}
      </h1>
      {roomQuery.isSuccess &&
        buildingQuery.isSuccess &&
        rooms.length < building.numberofroom && (
          <Link to={'create'} className="p-2 px-4 border rounded ">
            Thêm phòng
          </Link>
        )}
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">id</TableHead>
            <TableHead className="w-[100px]">Tên</TableHead>
            <TableHead>Số Người</TableHead>
            <TableHead>Giá</TableHead>
            <TableHead>Loại phòng</TableHead>
            <TableHead>hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roomQuery.isSuccess &&
            buildingQuery.isSuccess &&
            rooms.map((room) => (
              <TableRow key={room.Roomnumber}>
                <TableCell>{room.Roomnumber}</TableCell>
                <TableCell className="font-medium">
                  {building.name} - {room.name}
                </TableCell>
                <TableCell>{room.Roomslot}</TableCell>
                <TableCell>{room.Price}</TableCell>
                <TableCell>
                  {UserGenderEnum.getNameByValue(
                    room.Roomgender as UserGenderEnum
                  )}
                </TableCell>
                <TableCell className="flex gap-2">
                  <Link
                    to={`/admin/rooms/${room.Roomnumber}/edit`}
                    className="p-2 px-4 border rounded "
                  >
                    Sửa
                  </Link>
                  {room.RoomUsers.length === 0 && (
                    <Button
                      variant={'destructive'}
                      onClick={() => {
                        handleDeleteRoom(room.Roomnumber)
                      }}
                    >
                      Xóa
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default RoomsPage
