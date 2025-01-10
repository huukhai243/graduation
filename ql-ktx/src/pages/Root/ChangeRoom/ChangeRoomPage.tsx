import { useAppSelector } from '@/app/hooks'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { selectAuth } from '@/features/auth/authSlice'
import changeRoomServices from '@/services/changeRoomService'
import RoomServices, { RoomKey } from '@/services/roomServices'
import { RoomWithBuilding } from '@/types/roomType'
import { alertErrorAxios } from '@/utils/alert'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { z } from 'zod'

const formSchema = z.object({
  newRoomId: z.number(),
  description: z.string().min(5),
})

const ChangeRoomPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
    },
  })

  const navigate = useNavigate()

  const auth = useAppSelector(selectAuth)

  const { data: roomResponse, isSuccess } = useQuery({
    queryKey: [RoomKey, 'empty'],
    queryFn: RoomServices.allEmpty,
    refetchOnMount: true,
  })

  const mutation = useMutation({
    mutationFn: changeRoomServices.create,
  })

  const rooms: RoomWithBuilding[] = roomResponse?.data

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await mutation.mutateAsync(values)

      toast.success('Đăng ký đổi phòng thành công')
      navigate('/')
    } catch (error) {
      alertErrorAxios(error)
    }
  }

  return (
    <div className="flex w-full h-screen justify-center items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 border p-4 w-2/4 m-auto mt-20"
        >
          <FormField
            control={form.control}
            name="newRoomId"
            render={() => (
              <FormItem className="space-y-3">
                <RadioGroup
                  onValueChange={(value) => {
                    form.setValue('newRoomId', Number(value))
                  }}
                  className="flex flex-col space-y-1"
                >
                  <div className="w-full flex flex-wrap gap-12">
                    {isSuccess &&
                      auth &&
                      rooms.map(
                        (room) =>
                          room.Roomnumber !== +auth.user.RoomNumber && (
                            <FormItem
                              key={room.Roomnumber}
                              className="flex items-center space-x-3 rounded-md border p-4"
                            >
                              <FormControl>
                                <RadioGroupItem value={`${room.Roomnumber}`} />
                              </FormControl>
                              <FormLabel className="flex-1 space-y-1">
                                <p className="text-sm font-medium leading-none">
                                  {room.Building.name} - {room.name}
                                </p>
                                <p className="text-sm flex flex-col text-muted-foreground">
                                  <span>số người tối đa: {room.Roomslot}</span>
                                  <span>còn trống: {room.empty}</span>
                                  <span>giá {room.Price}</span>
                                </p>
                              </FormLabel>
                            </FormItem>
                          )
                      )}
                  </div>
                </RadioGroup>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lý do</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Đăng ký</Button>
        </form>
      </Form>
    </div>
  )
}

export default ChangeRoomPage
