import {
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
import RoomServices, { RoomKey } from '@/services/roomServices'
import { Room } from '@/types/roomType'
import { useQuery } from '@tanstack/react-query'
import { UseFormReturn } from 'react-hook-form'

type RoomSelectBoxProp = {
  form: UseFormReturn<
    {
      UserID: string
      Name: string
      Password: string
      Phone: string
      Building: string
      RoomNumber: string
      UserType: string
      Gender: string
      Email: string
    },
    any,
    undefined
  >
  buildingId: string
}

const RoomSelectBox = ({ form, buildingId }: RoomSelectBoxProp) => {
  const { data: roomResponse, isSuccess } = useQuery({
    queryKey: [RoomKey, 'buildings', buildingId],
    queryFn: () => RoomServices.allByBuildingId(buildingId),
  })

  const rooms: Room[] = roomResponse?.data

  return (
    <FormField
      control={form.control}
      name="RoomNumber"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Số phòng</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {isSuccess &&
                rooms.map((room) => (
                  <SelectItem
                    key={room.Roomnumber}
                    value={`${room.Roomnumber}`}
                  >
                    {room.Roomnumber}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default RoomSelectBox
