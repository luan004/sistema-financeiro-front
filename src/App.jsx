import { BrowserRouter } from 'react-router-dom'
import { SessionProvider } from './context/SessionContext'
import { Toaster } from '@/components/ui/sonner'
import AppRouter from './AppRouter'

function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <AppRouter />
        <Toaster />
      </SessionProvider>
    </BrowserRouter>
  )
}

export default App
