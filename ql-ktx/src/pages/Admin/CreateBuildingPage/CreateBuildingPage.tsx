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
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { alertErrorAxios } from '@/utils/alert'
import BuildingServices, { BuildingKey } from '@/services/buildingServices'
import BuildingTypeEnum from '@/constants/buildings/BuildingTypeEnum'

const formSchema = z.object({
  numberoffloor: z.string(),
  numberofroom: z.string(),
  roomtype: z.string(),
  name: z.string(),
})

const CreateBuildingPage = () => {
  const navigate = useNavigate()
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      numberoffloor: '',
      numberofroom: '',
    },
  })

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: BuildingServices.create,
  })

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await mutation.mutateAsync(values)

      queryClient.refetchQueries({
        queryKey: [BuildingKey],
      })

      toast.success('Thêm tòa nhà thành công')
      navigate(-1)
    } catch (error) {
      alertErrorAxios(error)
    }
  }

  return (
    <div className="container">
      <h1 className="text-4xl font-bold capitalize my-5">Thêm tòa nhà</h1>

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
                <FormLabel>Tên tòa nhà</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="numberoffloor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số tầng</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="numberofroom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số phòng</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="roomtype"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loại phòng</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder="Loại phòng"
                        defaultValue={BuildingTypeEnum.NORMAL}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.keys(BuildingTypeEnum.allNames()).map((key) => (
                      <SelectItem key={key} value={key}>
                        {BuildingTypeEnum.getNameByValue(
                          key as BuildingTypeEnum
                        )}
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

export default CreateBuildingPage
