import http from '@/utils/http'

const PREV_URL = '/registration-parkings'
export const RegistrationParkingKey = 'registrationParkings'

const RegistrationParkingServices = {
  all: (queryParams: { [key: string]: any }) => {
    return http.get(PREV_URL, { params: queryParams })
  },

  create: (body: { info: string; parkingType: string }) => {
    return http.post(PREV_URL, body)
  },

  active: (id: number) => {
    return http.put(`${PREV_URL}/${id}/active`)
  },

  distinct: (monthId: string) => {
    return http.get(`${PREV_URL}/distinct?month=${monthId}`)
  },
}

export default RegistrationParkingServices
