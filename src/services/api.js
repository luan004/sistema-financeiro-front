import { ApiError } from './ApiError'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

function getStoredToken() {
  try {
    const storedSession = localStorage.getItem('session')
    if (storedSession) {
      const parsedSession = JSON.parse(storedSession)
      if (parsedSession?.token) {
        return parsedSession.token
      }
    }
  } catch {}

  return localStorage.getItem('token') || ''
}

async function request(path, { method = 'GET', body, headers = {}, auth = false } = {}) {
  const config = {
    method,
    headers: {
      ...(auth ? { Authorization: `${getStoredToken()}` } : {}),
      ...headers,
    },
  }

  if (body !== undefined && body !== null) {
    config.body = JSON.stringify(body)
    config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json'
  }

  const response = await fetch(`${API_BASE_URL}${path}`, config)
  const rawBody = await response.text()
  let data = {}

  try {
    data = rawBody ? JSON.parse(rawBody) : {}
  } catch {
    data = rawBody
  }

  if (!response.ok) {
    const detail = typeof data === 'string'
      ? data
      : data?.detail || 'Falha desconhecida'

    throw new ApiError(detail, data)
  }

  return data
}

export const api = {
  get: (path, options = {}) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options = {}) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options = {}) => request(path, { ...options, method: 'PUT', body }),
  patch: (path, body, options = {}) => request(path, { ...options, method: 'PATCH', body }),
  delete: (path, options = {}) => request(path, { ...options, method: 'DELETE' }),
}

export function setApiBaseUrl(url) {
  return url
}
