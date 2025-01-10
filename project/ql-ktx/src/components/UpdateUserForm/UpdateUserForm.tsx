import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Input } from '@/components/ui/input'
import UserServices, { UserKey } from '@/services/userServices'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { User } from '@/types/userType'
import { alertErrorAxios } from '@/utils/alert'
import { zodResolver } from '@hookform/resolvers/zod'
import UserGenderEnum from '@/constants/users/UserGenderEnum'
import UserTypeEnum from '@/constants/users/UserTypeEnum'
import BuildingSelectBox from '../BuildingSelectBox'
import RoomSelectBox from '../RoomSelectBox/RoomSelectBox'

const formSchema = z.object({
  UserID: z.string(),
  Name: z.string(),
  Password: z.string(),
  Phone: z.string(),
  Building: z.string(),
  RoomNumber: z.string(),
  UserType: z.string(),
  Gender: z.string(),
  Email: z.string(),
})

const UpdateUserForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [buildingId, setBuildingId] = useState('')
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Name: '',
      Phone: '',
      Building: '',
      UserType: '',
      Gender: '',
      Email: '',
    },
  })

  const { data: userResponse, isSuccess } = useQuery({
    queryKey: [UserKey, 'get', id],
    queryFn: () => UserServices.get(Number(id)),
  })

  const queryclient = useQueryClient()

  const user: User = userResponse?.data

  useEffect(() => {
    if (isSuccess) {
      form.setValue('Name', user.Name)
      form.setValue('Phone', user.Phone)
      form.setValue('Building', user.Building)
      form.setValue('Email', user.Email)
      form.setValue('Gender', user.Gender)
      form.setValue('UserType', user.UserType)
      form.setValue('UserID', user.UserID)
      form.setValue('Password', user.Password)
      form.setValue('RoomNumber', user.RoomNumber)

      setBuildingId(user.Building)
    }
  }, [isSuccess])

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await UserServices.update(Number(id), values)
      toast.success('Update user success')
      queryclient.refetchQueries({
        queryKey: [UserKey],
      })
      navigate(-1)
    } catch (error) {
      alertErrorAxios(error)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 border p-4"
      >
        {user && (
          <div className="grid gap-8 grid-cols-3 ">
            <FormField
              control={form.control}
              name="Name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="Phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input type="phone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <BuildingSelectBox form={form} setBuildingId={setBuildingId} />
            {buildingId && (
              <RoomSelectBox form={form} buildingId={buildingId} />
            )}
            <FormField
              control={form.control}
              name="Email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="UserType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại người dùng</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.keys(UserTypeEnum.allNames()).map((key) => (
                        <SelectItem key={key} value={key}>
                          {UserTypeEnum.getNameByValue(key as UserTypeEnum)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giới tính</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.keys(UserGenderEnum.allNames()).map((key) => (
                        <SelectItem key={key} value={key}>
                          {UserGenderEnum.getNameByValue(key as UserGenderEnum)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {!user && <span>Không tồn tại người dùng </span>}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

export default UpdateUserForm
