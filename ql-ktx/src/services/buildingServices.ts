import http from '@/utils/http'

const PREV_URL = '/buildings'
export const BuildingKey = 'buildings'

type BuildingHandleParam = {
  numberoffloor: string
  numberofroom: string
  roomtype: string
  name: string
}

const BuildingServices = {
  all: () => {
    return http.get(`${PREV_URL}`)
  },

  get: (id: string) => {
    return http.get(`${PREV_URL}/${id}`)
  },

  rooms: (id: string) => {
    return http.get(`${PREV_URL}/${id}/rooms`)
  },

  create: (body: BuildingHandleParam) => {
    return http.post(PREV_URL, body)
  },

  update: (id: string, body: BuildingHandleParam) => {
    return http.put(`${PREV_URL}/${id}`, body)
  },

  delete: (id: number) => {
    return http.delete(`${PREV_URL}/${id}`)
  },
}

export default BuildingServices
