import { RoomWithBuilding } from './roomType'
import { User } from './userType'

export interface Registration {
  id: number
  RoomNumber1: number
  RoomNumber2: number
  RoomNumber3: number
  registrationstatus: string
  UserId: number
  User: User
  Room1: RoomWithBuilding
  Room2: RoomWithBuilding
  Room3: RoomWithBuilding
  RoomActive: number
}

export interface RegistrationCreate {
  RoomNumber1: number
  RoomNumber2: number
  RoomNumber3: number
}
