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
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { alertErrorAxios } from '@/utils/alert'
import UserTypeEnum from '@/constants/users/UserTypeEnum'
import UserGenderEnum from '@/constants/users/UserGenderEnum'
import BuildingSelectBox from '../BuildingSelectBox'
import RoomSelectBox from '../RoomSelectBox/RoomSelectBox'
import { useState } from 'react'

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

const CreateUserForm = () => {
  const [buildingId, setBuildingId] = useState('')

  const navigate = useNavigate()
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      UserID: '',
      Name: '',
      Password: '',
      Phone: '',
      UserType: '',
      Gender: '',
      Email: '',
      RoomNumber: '',
      Building: '',
    },
  })

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: UserServices.create,
  })

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await mutation.mutateAsync(values)

      queryClient.refetchQueries({
        queryKey: [UserKey],
      })

      toast.success('Add user success')
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
        <div className="grid gap-4 grid-cols-4 ">
          <FormField
            control={form.control}
            name="UserID"
            render={({ field }) => (
              <FormItem>
                <FormLabel>user id</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
            name="Password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
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
          {buildingId && <RoomSelectBox form={form} buildingId={buildingId} />}
          <FormField
            control={form.control}
            name="Email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>email</FormLabel>
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

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

export default CreateUserForm
