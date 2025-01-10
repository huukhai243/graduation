import { Command, CommandItem, CommandList } from '@/components/ui/command'
import { ADMIN_ROUTES_NAVIGATE } from '@/constants/routes/RoutesNavigate'
import UserTypeEnum from '@/constants/users/UserTypeEnum'
import { getUserLS } from '@/utils/authLS'
import { checkActiveRoute } from '@/utils/utils'
import { Link } from 'react-router-dom'

const Aside = () => {
  return (
    <div className="w-[300px] border shadow-md pt-6 p-2 min-h-screen h-full">
      <Command>
        <CommandList className=" max-h-full">
          {ADMIN_ROUTES_NAVIGATE.map((routeNavigate) => {
            let isActive = checkActiveRoute(
              routeNavigate.link,
              routeNavigate.isIndex
            )
            if (routeNavigate.none) {
              if (getUserLS()?.UserType !== UserTypeEnum.SUP_ADMIN) {
                return
              }
            }
            return (
              <CommandItem
                key={routeNavigate.link}
                ignoreAriaSelectedStyles
                asChild
              >
                <Link
                  to={routeNavigate.link}
                  className={`cursor-pointer hover:bg-primary/20 h-16 block ${
                    isActive ? 'bg-primary/50' : ''
                  }`}
                >
                  {routeNavigate.icon}
                  <span className="ml-3">{routeNavigate.name}</span>
                </Link>
              </CommandItem>
            )
          })}
        </CommandList>
      </Command>
    </div>
  )
}

export default Aside
