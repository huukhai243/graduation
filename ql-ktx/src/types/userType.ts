import UserGenderEnum from '@/constants/users/UserGenderEnum'
import UserTypeEnum from '@/constants/users/UserTypeEnum'
import { RoomWithBuilding } from './roomType'

export interface User {
  id: number
  UserID: string
  Name: string
  Password: string
  Phone: string
  Building: string
  UserType: UserTypeEnum | string
  Gender: UserGenderEnum | string
  Email: string
  RoomNumber: string
}

export interface UserFull extends User {
  room: RoomWithBuilding
}
