import PaymentTypeEnum from '@/constants/payments/PaymentTypeEnum'
import { User } from './userType'
import { Room, RoomWithBuilding } from './roomType'
import ParkingTypeEnum from '@/constants/payments/ParkingTypeEnum'

export interface PaymentRoom {
  id: number
  amount: number
  PaymentType?: string
  paymentstatus: PaymentTypeEnum
  paymentdate?: Date
  User: User
  monthId: number
}

export interface PaymentService {
  id: number
  amount: number
  PaymentType?: string
  paymentstatus: PaymentTypeEnum
  Paymentdate?: Date
  Room: RoomWithBuilding
  monthId: number
  electric: number
  electricPrice: number
  water: number
  waterPrice: number
  BuildingID: string
}

export interface PaymentParking {
  id: number
  amount: number
  ParkingType: ParkingTypeEnum
  paymentstatus: PaymentTypeEnum
  paymentdate?: Date
  User: User
  monthId: number
}
