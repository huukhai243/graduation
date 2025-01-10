import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import RegistrationServices from '@/services/registrationServices'
import RoomServices, { RoomKey } from '@/services/roomServices'
import { RegistrationCreate } from '@/types/registrationType'
import { RoomFull } from '@/types/roomType'
import { alertErrorAxios } from '@/utils/alert'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'react-toastify'

const RegistrationsPage = () => {
  const [checkedRooms, setCheckedRooms] = useState<number[]>([])

  const { data: roomResponse, isSuccess } = useQuery({
    queryKey: [RoomKey, 'empty'],
    queryFn: RoomServices.allEmpty,
    refetchOnMount: true,
  })

  const rooms: RoomFull[] = roomResponse?.data

  // 2. Define a submit handler.
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      if (checkedRooms.length < 3) {
        toast.error('Vui lòng chọn đủ 3 phòng')
        return
      }

      const body: RegistrationCreate = {
        RoomNumber1: checkedRooms[0],
        RoomNumber2: checkedRooms[1],
        RoomNumber3: checkedRooms[2],
      }

      await RegistrationServices.create(body)
      toast.success('Đăng ký phòng thành công')
    } catch (error) {
      alertErrorAxios(error)
    }
  }

  return (
    <div className="flex w-full h-screen justify-center items-center">
      <form onSubmit={onSubmit} className="space-y-8 border p-4 w-3/4">
        <h4>Phải đăng ký tối đa 3 nguyện vọng</h4>
        <div className="w-full flex flex-wrap gap-6">
          {isSuccess &&
            rooms.map((room) => (
              <label
                className="flex items-center space-x-4 rounded-md border p-4"
                key={room.Roomnumber}
                htmlFor={`room-${room.Roomnumber}`}
              >
                <Checkbox
                  id={`room-${room.Roomnumber}`}
                  onCheckedChange={(checked) => {
                    if (!checked) {
                      setCheckedRooms(
                        checkedRooms.filter(
                          (checkedRoom) => checkedRoom !== room.Roomnumber
                        )
                      )
                      return
                    }
                    if (checkedRooms.length >= 3) {
                      return
                    }
                    setCheckedRooms([...checkedRooms, room.Roomnumber])
                  }}
                  checked={
                    !!checkedRooms.find(
                      (checkedRoom) => checkedRoom === room.Roomnumber
                    )
                  }
                />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Phòng số {room.Roomnumber} - nhà {room.buildingid}
                  </p>
                  <p className="text-sm flex flex-col text-muted-foreground">
                    <span>số người tối đa: {room.Roomslot}</span>
                    <span>còn trống: {room.empty}</span>
                    <span>giá {room.Price}</span>
                  </p>
                </div>
              </label>
            ))}
        </div>
        <Button type="submit">Đăng ký</Button>
      </form>
    </div>
  )
}

export default RegistrationsPage
