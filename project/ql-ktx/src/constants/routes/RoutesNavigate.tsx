import { Contact, Home, MessageCircleMore, ScrollText } from 'lucide-react'

export const ROOT_ROUTES_NAVIGATE = [
  {
    name: 'Trang chủ',
    link: '/',
    isIndex: true,
  },
  {
    name: 'Đăng ký phòng',
    link: '/registration',
  },
  {
    name: 'Đăng ký chuyển phòng',
    link: '/change-room',
  },
  {
    name: 'Đăng ký gửi xe',
    link: '/register-to-park',
  },
  {
    name: 'Báo cáo',
    link: '/report',
  },
]

export const ADMIN_ROUTES_NAVIGATE = [
  {
    icon: <Home />,
    name: 'Trang chủ',
    link: '/admin',
    isIndex: true,
  },
  {
    icon: <Contact />,
    name: 'Quản lý người dùng',
    link: '/admin/users',
    none: true,
  },

  {
    icon: <ScrollText />,
    name: 'Quản lý sinh viên',
    link: '/admin/students',
  },
  {
    icon: <ScrollText />,
    name: 'Quản lý tòa nhà',
    link: '/admin/buildings',
  },
  {
    icon: <ScrollText />,
    name: 'Quản lý đơn đăng ký',
    link: '/admin/registrations',
  },
  {
    icon: <ScrollText />,
    name: 'Quản lý đơn đổi phòng',
    link: '/admin/change-rooms',
  },
  {
    icon: <ScrollText />,
    name: 'Quản lý đăng ký gửi xe',
    link: '/admin/registration-parkings',
  },
  {
    icon: <ScrollText />,
    name: 'Quản lý thanh toán',
    link: '/admin/payments',
  },
  {
    icon: <MessageCircleMore />,
    name: 'Quản lý tiền thanh toán',
    link: '/admin/config-payment',
  },
  {
    icon: <ScrollText />,
    name: 'Báo cáo',
    link: '/admin/reports',
  },
  {
    icon: <MessageCircleMore />,
    name: 'Thống kê tòa nhà',
    link: '/admin/statistic',
  },
]
