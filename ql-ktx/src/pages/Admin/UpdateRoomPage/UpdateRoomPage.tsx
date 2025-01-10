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
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { alertErrorAxios } from '@/utils/alert'
import { BuildingKey } from '@/services/buildingServices'
import RoomServices, { RoomHandleParam, RoomKey } from '@/services/roomServices'
import UserGenderEnum from '@/constants/users/UserGenderEnum'
import { useEffect } from 'react'
import { Room } from '@/types/roomType'

const formSchema = z.object({
  Roomslot: z.string(),
  Price: z.string(),
  Roomgender: z.string(),
  name: z.string(),
})

const UpdateRoomPage = () => {
  const { roomId } = useParams()
  const navigate = useNavigate()
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      Roomslot: '',
      Price: '',
    },
  })

  const roomQuery = useQuery({
    queryKey: [RoomKey, 'get', roomId],
    queryFn: () => RoomServices.get(roomId!),
  })

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: RoomHandleParam) => RoomServices.update(roomId!, data),
  })

  const room: Room = roomQuery.data?.data

  useEffect(() => {
    if (roomQuery.isSuccess) {
      form.setValue('name', room.name)
      form.setValue('Price', `${room.Price}`)
      form.setValue('Roomgender', `${room.Roomgender}`)
      form.setValue('Roomslot', `${room.Roomslot}`)
    }
  }, [roomQuery.isSuccess])

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await mutation.mutateAsync({
        ...values,
        buildingid: `${room.buildingid}`,
      })

      queryClient.refetchQueries({
        queryKey: [BuildingKey],
      })
      queryClient.refetchQueries({
        queryKey: [RoomKey],
      })

      toast.success('Sửa phòng thành công')
      navigate(-1)
    } catch (error) {
      alertErrorAxios(error)
    }
  }

  return (
    <div className="container">
      <h1 className="text-4xl font-bold capitalize my-5">Sửa phòng</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 border p-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên phòng</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Roomslot"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số người</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Roomgender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loại phòng</FormLabel>
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
          <FormField
            control={form.control}
            name="Price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giá</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Sửa</Button>
        </form>
      </Form>
    </div>
  )
}

export default UpdateRoomPage
