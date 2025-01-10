import { Outlet } from 'react-router-dom'
import Header from './components/Header'

const RootLayout = () => {
  return (
    <div className="flex flex-col">
      <Header />
      <div className="flex flex-1">
        {/* <SideBar /> */}

        <main className="w-full h-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default RootLayout
