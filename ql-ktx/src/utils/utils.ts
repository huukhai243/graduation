import { useAppDispatch } from '@/app/hooks'
import { resetAuth } from '@/features/auth/authSlice'
import { type ClassValue, clsx } from 'clsx'
import { useLocation, useNavigate } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'
import { resetAuthLS } from './authLS'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const checkActiveRoute = (route: string, isIndex?: boolean) => {
  const location = useLocation()

  if (!isIndex) {
    return location.pathname.includes(route)
  }
  return location.pathname === route
}

export function formattedDate(date: Date) {
  date = new Date(date)
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  return `${String(day).padStart(2, '0')}/${String(month).padStart(
    2,
    '0'
  )}/${year}`
}

export const useLogout = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  return () => {
    dispatch(resetAuth())
    resetAuthLS()
    navigate('/login')
  }
}

export const getRegistrationStatusName = (registrationStatus: string) => {
  switch (registrationStatus) {
    case '0':
      return 'Chờ duyệt'
    case '1':
      return 'Được duyệt'
    default:
      return 'không được duyệt'
  }
}

export const getParkingTypeName = (parkingType: string) => {
  switch (parkingType) {
    case 'bike':
      return 'Xe đạp'
    case 'moto':
      return 'Xe máy'
    default:
      return 'Xe'
  }
}
