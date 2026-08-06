export class ApiError extends Error {
  constructor(message, details = {}) {
    super(message)
    this.name = 'ApiError'
    this.details = details
    this.detail = details?.detail || message
  }
}
