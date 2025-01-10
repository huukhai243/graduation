import http from '@/utils/http'

const PREV_URL = '/reports'
export const ReportKey = 'reports'

const ReportServices = {
  all: () => {
    return http.get(PREV_URL)
  },
  byAuth: () => {
    return http.get(`${PREV_URL}/by-auth`)
  },
  create: (data: {
    title: string
    content: string
    image?: string
    video?: string
    parentId?: number
  }) => {
    return http.post(`${PREV_URL}`, data)
  },
}

export default ReportServices
