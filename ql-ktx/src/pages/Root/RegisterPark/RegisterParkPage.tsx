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
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { alertErrorAxios } from '@/utils/alert'
import RegistrationParkingServices from '@/services/registrationParkingServices'

const formSchema = z.object({
  parkingType: z.string(),
  info: z.string(),
})

const RegisterParkPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      info: '',
    },
  })

  const mutation = useMutation({
    mutationFn: RegistrationParkingServices.create,
  })

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await mutation.mutateAsync(values)

      toast.success('Đăng ký gửi xe thành công')
    } catch (error) {
      alertErrorAxios(error)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 border p-4 w-2/4 m-auto mt-20"
      >
        <FormField
          control={form.control}
          name="parkingType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại xe*</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại xe" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="moto">Xe máy</SelectItem>
                  <SelectItem value="bike">Xe đạp</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="info"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biển số xe(nếu có)</FormLabel>
              <FormControl>
                <Input {...field} />
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

export default RegisterParkPage
