import http from '@/utils/http'

const PREV_URL = '/months'
export const MonthKey = 'months'

const MonthServices = {
  all: () => {
    return http.get(PREV_URL)
  },
  get: (monthId: string) => {
    return http.get(`${PREV_URL}/${monthId}`)
  },
}

export default MonthServices
