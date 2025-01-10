import { RoomWithBuilding } from './roomType'
import { User } from './userType'

export interface ChangeRoom {
  id: number
  registrationstatus: string
  UserId: number
  User: User
  oldRoomId: number
  newRoomId: number
  oldRoom: RoomWithBuilding
  newRoom: RoomWithBuilding
  description: string
}
