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
import BuildingServices, { BuildingKey } from '@/services/buildingServices'
import BuildingTypeEnum from '@/constants/buildings/BuildingTypeEnum'
import { useEffect } from 'react'
import { Building } from '@/types/buildingType'
import { RoomKey } from '@/services/roomServices'
import { Room } from '@/types/roomType'

const formSchema = z.object({
  numberoffloor: z.string(),
  numberofroom: z.string(),
  roomtype: z.string(),
  name: z.string(),
})

const UpdateBuildingPage = () => {
  const { buildingId } = useParams()
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

  const { data: buildingResponse, isSuccess } = useQuery({
    queryKey: [BuildingKey, 'get', buildingId],
    queryFn: () => BuildingServices.get(buildingId!),
  })

  const { data: roomsResponse, isSuccess: isRoomsSuccess } = useQuery({
    queryKey: [RoomKey, 'building', buildingId],
    queryFn: () => BuildingServices.rooms(buildingId!),
  })

  const building: Building = buildingResponse?.data
  const rooms: Room[] = roomsResponse?.data

  useEffect(() => {
    if (isSuccess) {
      form.setValue('name', building.name)
      form.setValue('numberoffloor', `${building.numberoffloor}`)
      form.setValue('numberofroom', `${building.numberofroom}`)
      form.setValue('roomtype', building.roomtype)
    }
  }, [isSuccess])

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) =>
      BuildingServices.update(buildingId!, data),
  })

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!isRoomsSuccess) {
      form.setValue('numberofroom', `${building.numberofroom}`)
      return
    }

    const roomRealCount = rooms.length
    console.log(+values.numberofroom, roomRealCount)

    if (+values.numberofroom < roomRealCount) {
      toast.error('Bạn không thể sửa số phòng ít hơn số phòng hiện có')
      form.setValue('numberofroom', `${building.numberofroom}`)
      return
    }

    try {
      await mutation.mutateAsync(values)

      queryClient.refetchQueries({
        queryKey: [BuildingKey],
      })

      toast.success('Sửa tòa nhà thành công')
      navigate(-1)
    } catch (error) {
      alertErrorAxios(error)
    }
  }

  return (
    <div className="container">
      <h1 className="text-4xl font-bold capitalize my-5">Sửa tòa nhà</h1>

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
                  <Input
                    type="number"
                    {...field}
                    // onChange={onChangeNumberOfRoom}
                  />
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

          <Button type="submit">Sửa</Button>
        </form>
      </Form>
    </div>
  )
}

export default UpdateBuildingPage
