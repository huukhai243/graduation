import { User } from './userType'

export interface RegistrationParking {
  id: number
  registrationstatus: string
  UserId: number
  User: User
  info: string
  parkingType: string
}
