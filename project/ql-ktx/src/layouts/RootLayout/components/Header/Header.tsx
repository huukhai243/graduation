import { Button } from '@/components/ui/button'
import { ROOT_ROUTES_NAVIGATE } from '@/constants/routes/RoutesNavigate'
import { User } from '@/types/userType'
import { checkActiveRoute, useLogout } from '@/utils/utils'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Header = () => {
  const handleLogout = useLogout()
  const user : User = useSelector((state: any) => state.auth.user)

  return (
    <header className="p-2 pb-0 border-b bg-background">
      <div className="flex justify-between items-center">
        <div className="flex justify-between items-center gap-10">
          <h1>Logo</h1>
        </div>
        <nav className="flex gap-2">
          {ROOT_ROUTES_NAVIGATE.map((routeNavigate) => {
            let isActive = checkActiveRoute(
              routeNavigate.link,
              routeNavigate.isIndex
            )
            if ((user.RoomNumber || user.Building) && routeNavigate.link === '/registration') {
              return;
            }
            if ((!user.RoomNumber && !user.Building) && ['/change-room', '/register-to-park'].includes(routeNavigate.link)) {
              return
            }
            return (
              <Link
                key={routeNavigate.link}
                to={routeNavigate.link}
                className={`cursor-pointer hover:bg-primary/20 px-4 py-2  ${
                  isActive ? 'border-b-4' : ''
                }`}
              >
                {routeNavigate.name}
              </Link>
            )
          })}
        </nav>
        <div className="flex justify-between items-center gap-4">
          <Button
            variant="outline"
            className="rounded-sm p-2"
            onClick={handleLogout}
          >
            Đăng xuất
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header
