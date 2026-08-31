import { api } from './api'

export const AuthService = {
  login: (mail, password) => api.post('/login', { mail, password }),
  register: (name, email, password) => api.post('/register', { name, email, password })
}
