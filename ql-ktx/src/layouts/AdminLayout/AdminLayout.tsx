import { Button } from '@/components/ui/button'
import Aside from './components/Aside/Aside'
import Header from './components/Header'
import { Outlet, useNavigate } from 'react-router-dom'
import { ArrowLeftCircle } from 'lucide-react'

const AdminLayout = () => {
  const navigate = useNavigate()

  return (
    <div className="h-fix">
      <Header />
      <main className="flex justify-between mt-16 h-fix">
        <Aside />
        <section
          className={`flex-1 bg-secondary 
          p-6 px-10 h-fit 
          `}
        >
          <div className="bg-background w-full h-fit min-h-[500px] p-4 rounded">
            <Button
              variant={'link'}
              size={'icon'}
              onClick={() => {
                navigate(-1)
              }}
              className="-ms-3 -mt-3"
            >
              <ArrowLeftCircle className="rounded-full" size={30} />
            </Button>
            <Outlet />
          </div>
        </section>
      </main>
    </div>
  )
}

export default AdminLayout
