import { ConfigPayment } from '@/types/configPaymentType'
import http from '@/utils/http'

const ADMIN_URL = '/admin'
const PREV_URL = '/config-payments'
export const ConfigPaymentKey = 'config_payments'

const ConfigPaymentServices = {
  all: () => {
    return http.get(`${ADMIN_URL + PREV_URL}`)
  },
  update: (data: ConfigPayment) => {
    return http.put(`${ADMIN_URL + PREV_URL}`, data)
  },
}

export default ConfigPaymentServices
