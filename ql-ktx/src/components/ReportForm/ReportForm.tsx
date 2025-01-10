import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { alertErrorAxios } from '@/utils/alert'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { Input } from '../ui/input'
import ReportServices, { ReportKey } from '@/services/reportServices'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Report } from '@/types/reportType'

const formSchema = z.object({
  title: z.string(),
  content: z.string(),
  image: z.string().optional(),
  video: z.string().optional(),
  parentId: z.number().optional(),
})

type ReportFormProp = {
  parent?: Report
}

const ReportForm = ({ parent }: ReportFormProp) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  })

  const queryClient = useQueryClient()

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await ReportServices.create(values)

      queryClient.refetchQueries({
        queryKey: [ReportKey],
      })
      form.reset()

      toast.success('báo cáo thành công')
    } catch (error) {
      alertErrorAxios(error)
    }
  }

  useEffect(() => {
    if (parent) {
      form.setValue('parentId', parent.id)
      form.setValue(
        'title',
        !parent.parentId ? `Phản hồi ${parent.title}` : parent.title
      )
    } else {
      form.setValue('parentId', undefined)
      form.setValue('title', '')
    }
  }, [parent])

  return (
    <div className="flex w-full justify-center items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 border p-4 w-2/4"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tiêu đề</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nội dung</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">OK</Button>
        </form>
      </Form>
    </div>
  )
}

export default ReportForm
