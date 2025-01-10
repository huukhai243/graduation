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

const formSchema = z.object({
  amount: z.number(),
  userId: z.string(),
  monthId: z.string(),
  Roomnumber: z.number(),
})

const CreatePaymentPage = () => {
  const { monthId } = useParams()
  const navigate = useNavigate()
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const { data: userResponse, isSuccess } = useQuery({
    queryKey: [RoomUserKey, 'prev-payment', monthId],
    queryFn: () => RoomUserServices.usersPayment(monthId!),
  })

  const users: RoomUser[] = userResponse?.data

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: PaymentServices.createRoom,
  })

  useEffect(() => {
    if (monthId) {
      form.setValue('monthId', monthId)
    }
  }, [monthId])

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values)

      await mutation.mutateAsync(values)

      queryClient.refetchQueries({
        queryKey: [RoomUserKey, 'prev-payment', monthId],
      })

      queryClient.refetchQueries({
        queryKey: [PaymentKey, 'rooms', monthId],
      })

      toast.success('Thêm hóa đơn phòng thành công')
      navigate(-1)
    } catch (error) {
      alertErrorAxios(error)
    }
  }

  return (
    <div className="container">
      <h1 className="text-4xl font-bold capitalize my-5">Thêm phòng</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 border p-4"
        >
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sinh viên</FormLabel>
                <Select
                  onValueChange={(value) => {
                    form.setValue('userId', value)
                    form.setValue(
                      'amount',
                      users.find((user) => user.UserId === +value)!.Room.Price
                    )
                    form.setValue(
                      'Roomnumber',
                      users.find((user) => user.UserId === +value)!.RoomNumber
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
                      users.map((user) => (
                        <SelectItem key={user.id} value={`${user.UserId}`}>
                          {user.User.Name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
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

export default CreatePaymentPage
