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
import { Input } from '@/components/ui/input'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { alertErrorAxios } from '@/utils/alert'
import ConfigPaymentServices, {
  ConfigPaymentKey,
} from '@/services/configPaymentService'
import { useEffect } from 'react'
import { ConfigPayment } from '@/types/configPaymentType'

const formSchema = z.object({
  electric: z.number(),
  water: z.number(),
  parking_bike: z.number(),
  parking_moto: z.number(),
})

const ConfigPaymentPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const { data: configPaymentResponse, isSuccess } = useQuery({
    queryKey: [ConfigPaymentKey],
    queryFn: ConfigPaymentServices.all,
  })

  const configPayment: ConfigPayment = configPaymentResponse?.data

  useEffect(() => {
    if (isSuccess) {
      form.setValue('electric', configPayment.electric)
      form.setValue('water', configPayment.water)
      form.setValue('parking_bike', configPayment.parking_bike)
      form.setValue('parking_moto', configPayment.parking_moto)
    }
  }, [isSuccess])

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ConfigPaymentServices.update,
  })

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await mutation.mutateAsync(values)

      queryClient.refetchQueries({
        queryKey: [ConfigPaymentKey],
      })

      toast.success('cập nhật số tiền thanh toán thành công')
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
        <FormField
          control={form.control}
          name="electric"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiền điện</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  onChange={(e) => {
                    field.onChange(+e.target.value)
                  }}
                />
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
              <FormLabel>Tiền nước</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  onChange={(e) => {
                    field.onChange(+e.target.value)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="parking_bike"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiền giữ xe đạp</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  onChange={(e) => {
                    field.onChange(+e.target.value)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="parking_moto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiền giữ xe máy</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  onChange={(e) => {
                    field.onChange(+e.target.value)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

export default ConfigPaymentPage
