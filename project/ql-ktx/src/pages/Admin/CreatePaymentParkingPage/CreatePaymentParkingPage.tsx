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
import PaymentServices from '@/services/paymentServices'
import RegistrationParkingServices, {
  RegistrationParkingKey,
} from '@/services/registrationParkingServices'
import { RegistrationParking } from '@/types/registrationParkingType'
import { getParkingTypeName } from '@/utils/utils'

const formSchema = z.object({
  ParkingType: z.string(),
  userId: z.string(),
  monthId: z.string(),
})

const CreatePaymentParkingPage = () => {
  const { monthId } = useParams()
  const navigate = useNavigate()
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const { data: userResponse, isSuccess } = useQuery({
    queryKey: [RegistrationParkingKey, 'distinct', monthId],
    queryFn: () => RegistrationParkingServices.distinct(monthId!),
  })

  const users: RegistrationParking[] = userResponse?.data

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: PaymentServices.createParking,
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
        queryKey: [RegistrationParkingKey, 'distinct', monthId],
      })

      toast.success('Thêm hóa đơn giữ xe thành công')
      navigate(-1)
    } catch (error) {
      alertErrorAxios(error)
    }
  }

  return (
    <div className="container">
      <h1 className="text-4xl font-bold capitalize my-5">Thêm giữ xe</h1>

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
                      'ParkingType',
                      users.find((user) => user.UserId === +value)!.parkingType
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
                          {user.User.Name} (
                          {getParkingTypeName(user.parkingType)})
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

export default CreatePaymentParkingPage
