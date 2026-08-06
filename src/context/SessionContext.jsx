import React, { createContext, useContext, useEffect, useState } from 'react'

const SessionContext = createContext()

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(() => {
    const storedSession = window.localStorage.getItem('session')
    return storedSession ? JSON.parse(storedSession) : null
  })

  useEffect(() => {
    if (session) {
      window.localStorage.setItem('session', JSON.stringify(session))
    } else {
      window.localStorage.removeItem('session')
    }
  }, [session])

  const login = (payload) => {
    setSession(payload)
  }

  const logout = () => {
    setSession(null)
  }

  return (
    <SessionContext.Provider value={{ session, login, logout }}>
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error('useSession deve ser usado dentro de SessionProvider')
  }
  return context
}
