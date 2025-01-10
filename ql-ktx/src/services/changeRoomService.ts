import http from '@/utils/http'

const PREV_URL = '/change-rooms'
export const ChangeRoomKey = 'changeRooms'

const ChangeRoomServices = {
  all: (queryParams: { [key: string]: any }) => {
    return http.get(PREV_URL, { params: queryParams })
  },

  create: (body: { newRoomId: number; description: string }) => {
    return http.post(PREV_URL, body)
  },

  active: (id: number) => {
    return http.put(`${PREV_URL}/${id}/active`)
  },
}

export default ChangeRoomServices
