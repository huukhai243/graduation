import { User } from '@/types/userType'
import http from '@/utils/http'

const PREV_URL = '/users'
export const UserKey = 'users'

type CreateUserParam = Omit<User, 'id'>
type UpdateUserParam = Omit<User, 'id' | 'UserID' | 'Password'>

const UserServices = {
  all: () => {
    return http.get(PREV_URL)
  },
  get: (id: number) => {
    return http.get(`${PREV_URL}/${id}`)
  },

  create: (data: CreateUserParam) => {
    return http.post(PREV_URL, data)
  },
  update: (id: number, data: UpdateUserParam) => {
    return http.put(`${PREV_URL}/${id}`, data)
  },
  delete: (id: number) => {
    return http.delete(`${PREV_URL}/${id}`)
  },
}

export default UserServices
