import { Room } from './roomType'

export interface Building {
  buildingid: number
  name: string
  numberoffloor: number
  numberofroom: number
  roomtype: string
  Status: string
  Rooms: Room[]
}
