import { Provider } from 'react-redux'
import { AuthProvider } from './providers/AuthProvider'
import { store } from './app/store'
import { QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import { RouterProvider } from 'react-router-dom'
import queryClient from './config/reactQuery'
import router from './routes/router'

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <ToastContainer position="bottom-left" />
          <RouterProvider router={router} />
        </QueryClientProvider>
      </AuthProvider>
    </Provider>
  )
}

export default App
