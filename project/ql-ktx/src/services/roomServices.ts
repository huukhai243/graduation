import http from '@/utils/http'

const PREV_URL = '/rooms'
export const RoomKey = 'rooms'

export type RoomHandleParam = {
  Roomslot: string
  Price: string
  Roomgender: string
  buildingid: string
  name: string
}

const RoomServices = {
  allEmpty: () => {
    return http.get(`${PREV_URL}/empty`)
  },
  allByBuildingId: (buildingId: string) => {
    return http.get(`${PREV_URL}/buildings/${buildingId}`)
  },
  get: (roomId: string) => {
    return http.get(`${PREV_URL}/${roomId}`)
  },
  delete: (roomId: number) => {
    return http.delete(`${PREV_URL}/${roomId}`)
  },
  create: (room: RoomHandleParam) => {
    return http.post(`${PREV_URL}`, room)
  },
  update: (roomId: string, room: RoomHandleParam) => {
    return http.put(`${PREV_URL}/${roomId}`, room)
  },
}

export default RoomServices
