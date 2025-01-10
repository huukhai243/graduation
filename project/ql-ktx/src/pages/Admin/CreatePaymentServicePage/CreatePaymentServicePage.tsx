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

import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { alertErrorAxios } from '@/utils/alert'
import { useEffect } from 'react'
import PaymentServices, { PaymentKey } from '@/services/paymentServices'
import RoomUserServices, { RoomUserKey } from '@/services/roomUserServices'
import { RoomUser } from '@/types/roomUserType'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  BuildingID: z.number(),
  Roomnumber: z.string(),
  monthId: z.string(),
  electric: z.string(),
  water: z.string(),
})

const CreatePaymentServicePage = () => {
  const { monthId } = useParams()
  const navigate = useNavigate()
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      electric: '',
      water: '',
    },
  })

  const { data: userResponse, isSuccess } = useQuery({
    queryKey: [RoomUserKey, 'prev-service', monthId],
    queryFn: () => RoomUserServices.usersPaymentService(monthId!),
  })

  const rooms: RoomUser[] = userResponse?.data

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: PaymentServices.createService,
  })

  useEffect(() => {
    if (monthId) {
      form.setValue('monthId', monthId)
    }
  }, [monthId])

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await mutation.mutateAsync(values)

      queryClient.refetchQueries({
        queryKey: [RoomUserKey, 'prev-service', monthId],
      })

      queryClient.refetchQueries({
        queryKey: [PaymentKey, 'services', monthId],
      })

      toast.success('Thêm hóa đơn dịch vụ thành công')
      navigate(-1)
    } catch (error) {
      alertErrorAxios(error)
    }
  }

  return (
    <div className="container">
      <h1 className="text-4xl font-bold capitalize my-5">Thêm dịch vụ</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 border p-4"
        >
          <FormField
            control={form.control}
            name="Roomnumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phòng</FormLabel>
                <Select
                  onValueChange={(value) => {
                    form.setValue('Roomnumber', value)
                    form.setValue(
                      'BuildingID',
                      rooms.find((room) => room.RoomNumber === +value)!.Room
                        .buildingid
                    )
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isSuccess &&
                      rooms.map((room) => (
                        <SelectItem key={room.id} value={`${room.RoomNumber}`}>
                          {room.Room.Building.name} - {room.Room.name}
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
            name="electric"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="water"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số nước</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Thêm</Button>
        </form>
      </Form>
    </div>
  )
}

export default CreatePaymentServicePage
