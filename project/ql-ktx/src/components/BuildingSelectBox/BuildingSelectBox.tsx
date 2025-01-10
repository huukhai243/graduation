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
import BuildingServices, { BuildingKey } from '@/services/buildingServices'
import { Building } from '@/types/buildingType'
import { useQuery } from '@tanstack/react-query'
import { UseFormReturn } from 'react-hook-form'

type BuildingSelectBoxProp = {
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
  setBuildingId: (buildingId: string) => void
}

const BuildingSelectBox = ({ form, setBuildingId }: BuildingSelectBoxProp) => {
  const { data: buildingResponse, isSuccess } = useQuery({
    queryKey: [BuildingKey],
    queryFn: BuildingServices.all,
  })

  const buildings: Building[] = buildingResponse?.data

  return (
    <FormField
      control={form.control}
      name="Building"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tòa nhà</FormLabel>
          <Select
            onValueChange={(buildingId) => {
              field.onChange(buildingId)
              setBuildingId(buildingId)
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
                buildings.map((building) => (
                  <SelectItem
                    key={building.buildingid}
                    value={`${building.buildingid}`}
                  >
                    {building.buildingid}
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

export default BuildingSelectBox
