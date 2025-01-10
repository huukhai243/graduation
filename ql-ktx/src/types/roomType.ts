import { Building } from './buildingType'

export interface RoomFull {
  Roomnumber: number
  Status: string
  Roomslot: number
  Price: number
  Roomgender: string
  buildingid: number
  empty: number
  name: string
}

export type Room = Omit<RoomFull, 'empty'>

export interface RoomWithBuilding extends RoomFull {
  Building: Building
}

export interface RoomWithRoomUser extends RoomFull {
  RoomUsers: any[]
}
