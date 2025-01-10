import UserTypeEnum from '@/constants/users/UserTypeEnum'

export interface Auth {
  id: number
  Name: string
  email: string
  Phone: string
  UserType: UserTypeEnum
  Email: string
  Gender: string
  Building: string
  RoomNumber: string
}

export interface AuthResponse {
  user: Auth
  token: string
}
