import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useSession } from './context/SessionContext'
import Login from './pages/Login'
import NotFound from './pages/NotFound'

const AppRouter = () => {
  const { session } = useSession()

  useEffect(() => {
    if (session !== null) {
      console.log('Usuário logado/Sessão ativa:', session)
    }
  }, [session])

  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRouter
