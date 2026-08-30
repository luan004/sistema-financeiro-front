import { api } from './api'

export const AccountService = {
  list: ({ page = 1, limit = 8 } = {}) => api.get(`/accounts?page=${page}&limit=${limit}`),

  create: (description) => api.post('/accounts', { description }),

  remove: (id) => api.delete(`/accounts/${id}`),
}
