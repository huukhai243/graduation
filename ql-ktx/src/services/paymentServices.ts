import http from '@/utils/http'

const ADMIN_URL = '/admin'
const PREV_URL = '/payments'
export const PaymentKey = 'payments'

const PaymentServices = {
  rooms: (monthId: string) => {
    return http.get(`${ADMIN_URL + PREV_URL}/rooms/${monthId}`)
  },
  activeRoom: (paymentId: number) => {
    return http.put(`${ADMIN_URL + PREV_URL}/rooms/${paymentId}/active`)
  },
  services: (monthId: string) => {
    return http.get(`${ADMIN_URL + PREV_URL}/services/${monthId}`)
  },
  activeService: (paymentId: number) => {
    return http.put(`${ADMIN_URL + PREV_URL}/services/${paymentId}/active`)
  },
  parkings: (monthId: string) => {
    return http.get(`${ADMIN_URL + PREV_URL}/parkings/${monthId}`)
  },
  activeParking: (paymentId: number) => {
    return http.put(`${ADMIN_URL + PREV_URL}/parkings/${paymentId}/active`)
  },
  createRoom: (payment: { monthId: string }) => {
    return http.post(`${ADMIN_URL + PREV_URL}/rooms`, payment)
  },
  createService: (payment: {
    BuildingID: number
    electric: string
    water: string
    monthId: string
    Roomnumber: string
  }) => {
    return http.post(`${ADMIN_URL + PREV_URL}/services`, payment)
  },
  createParking: (payment: { monthId: string }) => {
    return http.post(`${ADMIN_URL + PREV_URL}/parkings`, payment)
  },
}

export default PaymentServices
