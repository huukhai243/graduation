import { RegistrationCreate } from '@/types/registrationType'
import http from '@/utils/http'

const PREV_URL = '/registrations'
export const RegistrationKey = 'registrations'

const RegistrationServices = {
  all: (queryParams: { [key: string]: any }) => {
    return http.get(PREV_URL, { params: queryParams })
  },

  create: (body: RegistrationCreate) => {
    return http.post(PREV_URL, body)
  },

  active: (id: number) => {
    return http.put(`${PREV_URL}/${id}/active`)
  },
}

export default RegistrationServices
