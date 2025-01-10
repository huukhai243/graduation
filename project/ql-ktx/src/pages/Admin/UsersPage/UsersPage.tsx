import UserServices, { UserKey } from '@/services/userServices'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { toast } from 'react-toastify'
import { alertErrorAxios } from '@/utils/alert'
import { User } from '@/types/userType'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import UserTypeEnum from '@/constants/users/UserTypeEnum'

const UsersPage = () => {
  const queryClient = useQueryClient()

  const { data: userResponse, isSuccess } = useQuery({
    queryKey: [UserKey],
    queryFn: UserServices.all,
  })

  const users: User[] = userResponse?.data

  const handleDeleteUser = async (id: number) => {
    try {
      await UserServices.delete(id)
      toast.success('Xóa người dùng thành công')
      queryClient.invalidateQueries({
        queryKey: [UserKey],
      })
    } catch (error) {
      alertErrorAxios(error)
    }
  }

  return (
    <div className="container">
      <Link to={'/admin/users/create'} className="p-2 px-4 border rounded ">
        Thêm người dùng
      </Link>
      <h1 className="text-4xl font-bold capitalize my-5">
        Danh sách người dùng
      </h1>
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>STT</TableHead>
            <TableHead className="w-[100px]">Tên</TableHead>
            <TableHead>Số điện thoại</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Giới tính</TableHead>
            <TableHead>Loại người dùng</TableHead>
            <TableHead>hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isSuccess &&
            users.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="font-medium">{user.Name}</TableCell>
                <TableCell>{user.Phone}</TableCell>
                <TableCell>{user.Email}</TableCell>
                <TableCell>{user.Gender}</TableCell>
                <TableCell>
                  {UserTypeEnum.getNameByValue(user.UserType as UserTypeEnum)}
                </TableCell>
                <TableCell>
                  <div className="flex gap-4">
                    <Link to={`/admin/users/update/${user.id}`}>
                      <Button variant="default">update</Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">delete</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Bạn có chắc chắn muốn xóa không?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Sau khi xóa sẽ không thể khôi phục
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Dừng lại</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              handleDeleteUser(user.id)
                            }}
                          >
                            Tiếp tục
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default UsersPage
