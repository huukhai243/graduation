import http from '@/utils/http'

type LoginParam = {
  email: string
  password: string
}

const AuthServices = {
  login: (param: LoginParam) => {
    return http.post('/login', param)
  },
}

export default AuthServices
