import RoomUserServices, { RoomUserKey } from '@/services/roomUserServices'
import { useQuery } from '@tanstack/react-query'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
    title: {
      display: true,
      position: 'bottom' as const,
      text: 'Biểu đồ thống kê số người ở tòa nhà',
    },
  },
}
const StatisticPage = () => {
  const [data, setData] = useState<any>(null)
  const { data: statisticResponse, isSuccess } = useQuery({
    queryKey: [RoomUserKey, 'statistic'],
    queryFn: RoomUserServices.statistic,
    refetchOnMount: true,
  })

  const statisticData: { buildingid: number; total: number; name: string }[] =
    statisticResponse?.data

  useEffect(() => {
    if (isSuccess) {
      const newData = {
        labels: statisticData.map(
          (statisticDataItem) => `Tòa nhà ${statisticDataItem.name}`
        ),
        datasets: [
          {
            label: 'số người',
            data: statisticData.map(
              (statisticDataItem) => statisticDataItem.total
            ),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
        ],
      }

      setData(newData)
    }
  }, [isSuccess])

  return (
    <div>
      <h1 className="text-3xl font-bold capitalize my-5">Thống kê tòa nhà</h1>
      {data && <Bar options={options} data={data} />}
    </div>
  )
}

export default StatisticPage
