import { createBrowserRouter, Outlet } from 'react-router-dom'
// import RootLayout from '@/layouts/RootLayout'
import NotFoundPage from '@/pages/NotFoundPage'
import { AuthEvent, AuthGuard } from '@/providers/AuthProvider'
import RootLayout from '@/layouts/RootLayout'
import HomePage from '@/pages/Root/HomePage'
import LoginPage from '@/pages/LoginPage'
import AuthenticationLayout from '@/layouts/AuthenticationLayout'
import AdminLayout from '@/layouts/AdminLayout'
import UsersPage from '@/pages/Admin/UsersPage'
import CreateUserPage from '@/pages/Admin/CreateUserPage'
import UpdateUserPage from '@/pages/Admin/UpdateUserPage'
import {
  AdminGuard,
  SupAdminGuard,
} from '@/providers/AuthProvider/AuthProvider'
import StatisticPage from '@/pages/Admin/StatisticPage'
import StudentsPage from '@/pages/Admin/StudentsPage'
import RegistrationsPage from '@/pages/Admin/RegistrationsPage'
import RegistrationPage from '@/pages/Root/RegistrationPage'
import PaymentsPage from '@/pages/Admin/PaymentsPage'
import PaymentMonthPage from '@/pages/Admin/PaymentMonthPage'
import PaymentsLayout from '@/layouts/AdminLayout/PaymentsLayout'
import ConfigPaymentPage from '@/pages/Admin/ConfigPaymentPage'
import ChangeRoomPage from '@/pages/Root/ChangeRoom/ChangeRoomPage'
import RegisterParkPage from '@/pages/Root/RegisterPark'
import RegistrationParkingsPage from '@/pages/Admin/RegistrationParkingsPage'
import ChangeRoomsPage from '@/pages/Admin/ChangeRoomsPage'
import BuildingsPage from '@/pages/Admin/BuildingsPage'
import CreateBuildingPage from '@/pages/Admin/CreateBuildingPage'
import UpdateBuildingPage from '@/pages/Admin/UpdateBuildingPage'
import RoomsPage from '@/pages/Admin/RoomsPage'
import CreateRoomPage from '@/pages/Admin/CreateRoomPage'
import UpdateRoomPage from '@/pages/Admin/UpdateRoomPage'
import CreatePaymentPage from '@/pages/Admin/CreatePaymentPage'
import CreatePaymentServicePage from '@/pages/Admin/CreatePaymentServicePage'
import CreatePaymentParkingPage from '@/pages/Admin/CreatePaymentParkingPage'
import ReportPage from '@/pages/Root/ReportPage'
import ReportsPage from '@/pages/Admin/ReportsPage'

const router = createBrowserRouter([
  {
    path: '*',
    element: <NotFoundPage />,
  },
  {
    element: (
      <AuthGuard>
        <AuthEvent />
      </AuthGuard>
    ),
    children: [
      {
        element: <RootLayout />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: 'registration',
            element: <RegistrationPage />,
          },
          {
            path: 'change-room',
            element: <ChangeRoomPage />,
          },
          {
            path: 'register-to-park',
            element: <RegisterParkPage />,
          },
          {
            path: 'report',
            element: <ReportPage />,
          },
        ],
      },
      {
        path: 'admin',
        element: (
          <AdminGuard>
            <AdminLayout />
          </AdminGuard>
        ),
        children: [
          {
            index: true,
            element: <>Home page</>,
          },
          {
            path: 'statistic',
            element: <StatisticPage />,
          },
          {
            path: 'students',
            element: <StudentsPage />,
          },
          {
            path: 'registrations',
            element: <RegistrationsPage />,
          },
          {
            path: 'reports',
            element: <ReportsPage />,
          },
          {
            path: 'change-rooms',
            element: <ChangeRoomsPage />,
          },
          {
            path: 'registration-parkings',
            element: <RegistrationParkingsPage />,
          },
          {
            path: 'config-payment',
            element: <ConfigPaymentPage />,
          },
          {
            path: 'buildings',
            children: [
              {
                index: true,
                element: <BuildingsPage />,
              },
              {
                path: 'create',
                element: <CreateBuildingPage />,
              },
              {
                path: ':buildingId',
                children: [
                  {
                    path: 'edit',
                    element: <UpdateBuildingPage />,
                  },
                  {
                    path: 'rooms',
                    children: [
                      {
                        index: true,

                        element: <RoomsPage />,
                      },
                      {
                        path: 'create',
                        element: <CreateRoomPage />,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            path: 'rooms/:roomId/edit',
            element: <UpdateRoomPage />,
          },
          {
            path: 'users',
            element: (
              <SupAdminGuard>
                <Outlet />
              </SupAdminGuard>
            ),
            children: [
              {
                index: true,
                element: <UsersPage />,
              },
              {
                path: 'create',
                element: <CreateUserPage />,
              },
              {
                path: 'update/:id',
                element: <UpdateUserPage />,
              },
            ],
          },
          {
            path: 'payments',
            element: <PaymentsLayout />,
            children: [
              {
                index: true,
                element: <PaymentsPage />,
              },
              {
                path: ':monthId',
                children: [
                  {
                    index: true,
                    element: <PaymentMonthPage />,
                  },
                  {
                    path: 'create-payment-room',
                    element: <CreatePaymentPage />,
                  },
                  {
                    path: 'create-payment-service',
                    element: <CreatePaymentServicePage />,
                  },
                  {
                    path: 'create-payment-parking',
                    element: <CreatePaymentParkingPage />,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    element: <AuthenticationLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
    ],
  },
])

export default router
