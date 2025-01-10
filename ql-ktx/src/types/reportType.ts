import { User } from './userType'

export interface Report {
  id: number
  title: string
  content: string
  image: string | null
  video: string | null
  parentId: number | null
  User: User
  reports: Report[] | null
}
