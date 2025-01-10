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
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { toast } from 'react-toastify'
import { alertErrorAxios } from '@/utils/alert'

const BuildingsPage = () => {
  const { data: buildingResponse, isSuccess } = useQuery({
    queryKey: [BuildingKey],
    queryFn: BuildingServices.all,
  })

  const buildings: Building[] = buildingResponse?.data
  const queryClient = useQueryClient()

  const handleDeleteBuilding = async (id: number) => {
    try {
      await BuildingServices.delete(id)
      toast.success('Xóa phòng thành công')
      queryClient.invalidateQueries({
        queryKey: [BuildingKey],
      })
    } catch (error) {
      alertErrorAxios(error)
    }
  }

  return (
    <div className="container">
      <h1 className="text-4xl font-bold capitalize my-5">Danh sách tòa nhà</h1>
      <Link to={'create'} className="p-2 px-4 border rounded ">
        Thêm tòa nhà
      </Link>
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">id</TableHead>
            <TableHead className="w-[100px]">Tên</TableHead>
            <TableHead>Số tầng</TableHead>
            <TableHead>Số phòng</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead>hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isSuccess &&
            buildings.map((building) => (
              <TableRow key={building.buildingid}>
                <TableCell>{building.buildingid}</TableCell>
                <TableCell className="font-medium">{building.name}</TableCell>
                <TableCell>{building.numberoffloor}</TableCell>
                <TableCell>{building.numberofroom}</TableCell>
                <TableCell>{building.roomtype}</TableCell>
                <TableCell className="flex gap-2">
                  <Link
                    to={`${building.buildingid}/edit`}
                    className="p-2 px-4 border rounded "
                  >
                    Sửa
                  </Link>
                  <Link
                    to={`${building.buildingid}/rooms`}
                    className="p-2 px-4 border rounded "
                  >
                    Phòng
                  </Link>
                  {building.Rooms.length === 0 && (
                    <Button
                      variant={'destructive'}
                      onClick={() => {
                        handleDeleteBuilding(building.buildingid)
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

export default BuildingsPage
