import { Auth, AuthResponse } from '@/types/authType'

const AUTH_LS_KEY = {
  accessToken: 'token',
  user: 'user',
}

export const getTokenLS = () => {
  return localStorage.getItem(AUTH_LS_KEY.accessToken) ?? ''
}

export const getUserLS = (): Auth | null => {
  const user = localStorage.getItem(AUTH_LS_KEY.user)
  return user ? JSON.parse(user) : null
}

export const setAuthLS = (authResponse: AuthResponse) => {
  localStorage.setItem(AUTH_LS_KEY.accessToken, authResponse.token)
  localStorage.setItem(AUTH_LS_KEY.user, JSON.stringify(authResponse.user))
}

export const resetAuthLS = () => {
  localStorage.removeItem(AUTH_LS_KEY.accessToken)
  localStorage.removeItem(AUTH_LS_KEY.user)
}
