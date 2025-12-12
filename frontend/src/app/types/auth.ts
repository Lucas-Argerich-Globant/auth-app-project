export type AuthStatus = 'authenticated' | 'unauthenticated' | 'pending'

export type User = {
  id: string
  email: string
  firstName: string
  middleName?: string
  lastName: string
  role: string
  createdAt: string
  updatedAt: string
}

export type ApiResponse<T> =
  | {
      status: 'success'
      data: T
    }
  | {
      status: 'error'
      message: string
    }

export type AuthResponseData = ApiResponse<{
  user: User
  token: string
}>

export type AuthStoreResult = { isAuthenticated: boolean; error: null } | { isAuthenticated: false; error: string }
