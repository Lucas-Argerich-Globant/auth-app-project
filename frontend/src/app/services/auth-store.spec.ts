import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { AuthStore } from './auth-store'
import { AUTH_HTTP_CREDENTIALS_INTERCEPTOR_DISABLED } from '../interceptors/auth-http-credentials'
import { User } from '../types/auth'
import { firstValueFrom } from 'rxjs'

const api_url = 'http://localhost:3000/api'

describe('AuthStore', () => {
  let store: AuthStore
  let http: HttpTestingController

  const mockUser: User = {
    id: '1',
    email: 'john@test.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date()
  }

  beforeEach(() => {
    vi.restoreAllMocks()

    const mockLocalStorage = {
      getItem: vi.fn().mockReturnValue(null),
      setItem: vi.fn(),
      removeItem: vi.fn()
    }

    Object.defineProperty(globalThis, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    })
    
    store = TestBed.inject(AuthStore)
    http = TestBed.inject(HttpTestingController)
  })

  // --------------------------------------------------------
  it('should logout and clear state', () => {
    store['handleAuthSuccess']({
      status: 'success',
      data: { user: mockUser, token: 'abc' }
    })

    store.logout()

    expect(store.authStatus()).toBe('unauthenticated')
    expect(store.token()).toBeNull()
    expect(store.user()).toBeNull()

    TestBed.tick()

    // ✔ FIX: ensure removeItem is a spy
    expect(localStorage.removeItem).toHaveBeenCalledWith('auth_token')
  })

  // --------------------------------------------------------
  it('should restore session when token exists', () => {
    vi.spyOn(localStorage, 'getItem').mockReturnValue('existing-token')
    
    TestBed.resetTestingModule()
    
    store = TestBed.inject(AuthStore)
    http = TestBed.inject(HttpTestingController)

    const req = http.expectOne(`${api_url}/auth/me`)
    expect(req.request.method).toBe('GET')
    expect(req.request.headers.get('authorization')).toBe('Bearer existing-token')
    expect(req.request.context.get(AUTH_HTTP_CREDENTIALS_INTERCEPTOR_DISABLED)).toBe(true)

    req.flush({
      status: 'success',
      data: { user: mockUser, token: 'existing-token' }
    })

    expect(store.authStatus()).toBe('authenticated')
    expect(store.user()).toEqual(mockUser)
    expect(store.token()).toBe('existing-token')
  })

  // --------------------------------------------------------
  it('should emit false for unauthenticated', async () => {
    store.logout()

    // ✔ FIX: toObservable requires injection context in Angular 17–21
    const result = await TestBed.runInInjectionContext(() => firstValueFrom(store.isAuthenticated()))

    expect(result).toBe(false)
  })

  it('should emit true for authenticated', async () => {
    store['handleAuthSuccess']({
      status: 'success',
      data: { user: mockUser, token: 'tok' }
    })

    // ✔ FIX: again wrap in injection context
    const result = await TestBed.runInInjectionContext(() => firstValueFrom(store.isAuthenticated()))

    expect(result).toBe(true)
  })

  // --------------------------------------------------------
  // login
  // --------------------------------------------------------
  it('should login successfully', () => {
    store.login('john@test.com', '123456').subscribe((res) => {
      expect(res.isAuthenticated).toBe(true)
      expect(res.error).toBeNull()
      expect(store.user()).toEqual(mockUser)
      expect(store.authStatus()).toBe('authenticated')
    })

    const req = http.expectOne(`${api_url}/auth/login`)
    expect(req.request.method).toBe('POST')

    req.flush({
      status: 'success',
      data: { user: mockUser, token: 'mock-token' }
    })
  })

  it('should handle login error', () => {
    store.login('a', 'b').subscribe((res) => {
      expect(res.isAuthenticated).toBe(false)
      expect(res.error).toBe('Invalid credentials')
    })

    const req = http.expectOne(`${api_url}/auth/login`)
    req.flush({ message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' })
  })

  // --------------------------------------------------------
  it('should register successfully', () => {
    store
      .register('email@test.com', 'pass123', {
        first: 'Jane',
        last: 'Doe'
      })
      .subscribe((res) => {
        expect(res.isAuthenticated).toBe(true)
        expect(store.user()?.email).toBe(mockUser.email)
      })

    const req = http.expectOne(`${api_url}/auth/register`)
    expect(req.request.method).toBe('POST')

    req.flush({
      status: 'success',
      data: { user: mockUser, token: 'mock-token' }
    })
  })

  it('should handle registration error', () => {
    store.register('bad@test.com', '123', { first: 'A', last: 'B' }).subscribe((res) => {
      expect(res.isAuthenticated).toBe(false)
      expect(res.error).toBe('Email already exists')
    })

    const req = http.expectOne(`${api_url}/auth/register`)
    req.flush({ message: 'Email already exists' }, { status: 400, statusText: 'Bad Request' })
  })
})
