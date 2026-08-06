import React from 'react'
import { Navigate, Routes, Route } from 'react-router-dom'
import { useSession } from './context/SessionContext'
import AppLayout from './components/layout/AppLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Movements from './pages/Movements'
import NotFound from './pages/NotFound'

const ProtectedRoute = ({ children }) => {
  const { session } = useSession()

  if (!session?.token) {
    return <Navigate to="/login" replace />
  }

  return children
}

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="movements" element={<Movements />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRouter
