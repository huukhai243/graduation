import PaymentParkings from '@/components/Payments/PaymentParkings'
import PaymentRooms from '@/components/Payments/PaymentRooms'
import PaymentServices from '@/components/Payments/PaymentServices'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useQueryParams from '@/hooks/useQueryParams'
import { useNavigate } from 'react-router-dom'

const PaymentMonthPage = () => {
  const queryParam = useQueryParams()
  const navigate = useNavigate()

  return (
    <Tabs
      defaultValue={queryParam.tab ?? 'rooms'}
      className="w-full"
      onValueChange={(value) => {
        const params = new URLSearchParams()
        params.set('tab', value)
        navigate({ search: params.toString() })
      }}
    >
      <TabsList>
        <TabsTrigger value="rooms">Phòng</TabsTrigger>
        <TabsTrigger value="services">Dịch vụ</TabsTrigger>
        <TabsTrigger value="parkings">Giữ xe</TabsTrigger>
      </TabsList>
      <TabsContent value="rooms">
        <PaymentRooms />
      </TabsContent>
      <TabsContent value="services">
        <PaymentServices />
      </TabsContent>
      <TabsContent value="parkings">
        <PaymentParkings />
      </TabsContent>
    </Tabs>
  )
}

export default PaymentMonthPage
