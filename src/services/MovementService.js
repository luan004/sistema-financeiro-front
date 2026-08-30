import { AccountService } from './AccountService'
import { api } from './api'

export const MovementService = {
  list: ({ page = 1, limit = 8 } = {}) => api.get(`/movements?page=${page}&limit=${limit}`),

  create: ({ accountId, description, amount }) =>
    api.post('/movements', { accountId, description, amount }),

  remove: (id) => api.delete(`/movements/${id}`),

  listAccounts: ({ page = 1, limit = 100 } = {}) => AccountService.list({ page, limit }),
}
