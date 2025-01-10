import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { User, UserFull } from '@/types/userType'
import UserServices, { UserKey } from '@/services/userServices'
import { useSelector } from 'react-redux'
import UserGenderEnum from '@/constants/users/UserGenderEnum'
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

const HomePage = () => {
  const user: User = useSelector((state: any) => state.auth.user)
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
    queryKey: [UserKey, 'get', user.id],
    queryFn: () => UserServices.get(Number(user.id)),
  })

  const userRs: UserFull = userResponse?.data

  useEffect(() => {
    if (isSuccess) {
      form.setValue('Name', user.Name)
      form.setValue('Phone', user.Phone)
      form.setValue('Email', user.Email)
      form.setValue(
        'Gender',
        UserGenderEnum.getNameByValue(user.Gender as UserGenderEnum)
      )
      form.setValue('UserType', user.UserType)
      form.setValue('UserID', user.UserID)
      form.setValue('Password', user.Password)
      form.setValue(
        'RoomNumber',
        `${
          userRs.room
            ? `${userRs.room.Building.name} - ${userRs.room.name}`
            : ''
        }`
      )
    }
  }, [isSuccess, user])

  return (
    <>
      <h1 className="text-lg text-black	mt-10 ml-10">Wellcome {user?.Name}</h1>
      <div className="z-10 rounded-lg w-full h-full text-sm lg:flex inline-flex	mt-20">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(() => {})}
            className="space-y-8 border p-4  m-auto"
          >
            <h1>Thông tin người dùng</h1>
            <div className="grid gap-8 grid-cols-2">
              <FormField
                control={form.control}
                name="Name"
                disabled
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
                disabled
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
              <FormField
                control={form.control}
                name="RoomNumber"
                disabled
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phòng</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Email"
                disabled
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
                name="Gender"
                defaultValue={user?.Gender}
                disabled
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giới tính</FormLabel>
                    <Input type="email" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>
    </>
  )
}

export default HomePage
