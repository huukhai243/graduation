import { RoomWithBuilding } from './roomType'
import { User } from './userType'

export interface RoomUser {
  id: number
  status: string
  dateIn: Date
  dateOut: Date
  UserId: number
  RoomNumber: number
  User: User
  Room: RoomWithBuilding
}
