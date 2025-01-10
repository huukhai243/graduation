import { Button } from '@/components/ui/button'
import { useLogout } from '@/utils/utils'

const Header = () => {
  const handleLogout = useLogout()

  return (
    <header className="h-16 p-2 border-b fixed left-0 right-0 top-0 bg-background z-50">
      <div className="flex justify-between items-center">
        <div className="flex justify-between items-center gap-10">
          <h1>Logo</h1>
        </div>
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
