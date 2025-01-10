import http from '@/utils/http'

const PREV_URL = '/room-users'
export const RoomUserKey = 'room_users'

const RoomUserServices = {
  statistic: () => {
    return http.get(`${PREV_URL}/statistic`)
  },
  users: () => {
    return http.get(`/admin/users`)
  },
  usersPayment: (monthId: string) => {
    return http.get(`${PREV_URL}/prev-payment?month=${monthId}`)
  },
  usersPaymentService: (monthId: string) => {
    return http.get(`${PREV_URL}/prev-service?month=${monthId}`)
  },
}

export default RoomUserServices
