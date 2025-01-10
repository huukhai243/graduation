import ReportForm from '@/components/ReportForm'
import ReportServices, { ReportKey } from '@/services/reportServices'
import { Report } from '@/types/reportType'
import { useQuery } from '@tanstack/react-query'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import UserTypeEnum from '@/constants/users/UserTypeEnum'

const ReportsPage = () => {
  const [parent, setParent] = useState<Report>()
  const { data: reportResponse, isSuccess } = useQuery({
    queryKey: [ReportKey],
    queryFn: ReportServices.all,
  })

  const reports: Report[] = reportResponse?.data
  return (
    <>
      <div className="flex flex-col gap-4 w-full justify-center items-center p-8">
        {isSuccess &&
          reports.map((report) => (
            <>
              <Card key={report.id} className="w-full">
                <CardHeader>
                  <CardTitle>{report.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Nội dung: {report.content}</p>
                  <i>
                    Từ:{' '}
                    {report.User.UserType !== UserTypeEnum.STUDENT
                      ? UserTypeEnum.getNameByValue(
                          report.User.UserType as UserTypeEnum
                        )
                      : report.User.Name}
                  </i>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button onClick={() => setParent(report)}>Phản hồi</Button>
                </CardFooter>
              </Card>
              {report.reports &&
                report.reports.map((subReport) => (
                  <Card key={subReport.id} className="w-full ml-12">
                    <CardHeader>
                      <CardTitle>{subReport.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Nội dung: {subReport.content}</p>
                      <i>
                        Từ:{' '}
                        {subReport.User.UserType !== UserTypeEnum.STUDENT
                          ? UserTypeEnum.getNameByValue(
                              subReport.User.UserType as UserTypeEnum
                            )
                          : subReport.User.Name}
                      </i>
                    </CardContent>
                  </Card>
                ))}
            </>
          ))}
      </div>
      {parent && (
        <>
          <Button onClick={() => setParent(undefined)} className="mx-8">
            Hủy
          </Button>
          <ReportForm parent={parent} />
        </>
      )}
    </>
  )
}

export default ReportsPage
