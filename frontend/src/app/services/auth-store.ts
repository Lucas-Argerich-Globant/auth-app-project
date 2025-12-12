import { HttpClient, HttpContext } from '@angular/common/http'
import { computed, effect, inject, Injectable, signal } from '@angular/core'
import { catchError, filter, map, Observable, of, take } from 'rxjs'
import { AuthResponseData, AuthStatus, AuthStoreResult, User } from '../types/auth'
import { AUTH_HTTP_CREDENTIALS_INTERCEPTOR_DISABLED } from '../interceptors/auth-http-credentials'
import { toObservable } from '@angular/core/rxjs-interop'

const api_url = 'http://localhost:3000/api'

export type LoginParams = [email: string, password: string]
export type RegisterParams = [email: string, password: string, name: { first: string; middle?: string; last: string }]

/**
 * Central authentication state manager.
 *
 * Responsibilities:
 * - Holds auth state (status, user, token) using Angular signals
 * - Persists auth token to localStorage
 * - Restores session on application startup
 * - Exposes login / register / logout APIs
 */
@Injectable({ providedIn: 'root' })
export class AuthStore {
  /** Internal authentication status signal */
  private _authStatus = signal<AuthStatus>('pending')

  /** Internal authenticated user signal */
  private _user = signal<User | null>(null)

  /** Internal auth token signal */
  private _token = signal<string | null>(null)

  private http = inject(HttpClient)

  /** Public computed auth status */
  authStatus = computed(() => this._authStatus())

  /** Public computed authenticated user */
  user = computed(() => this._user())

  /** Public computed auth token */
  token = computed(() => this._token())

  /**
   * Initializes the auth store.
   *
   * - Restores an existing session (if a token exists)
   * - Synchronizes token changes with localStorage
   */
  constructor() {
    this.checkLocalSession().subscribe()

    effect(() => {
      const token = this._token()
      if (token) {
        localStorage.setItem('auth_token', token)
      } else {
        localStorage.removeItem('auth_token')
      }
    })
  }

  /**
   * Emits a single boolean indicating whether the user is authenticated.
   *
   * - Skips the initial `pending` state
   * - Emits once and completes
   *
   * @returns Observable<boolean>
   */
  isAuthenticated(): Observable<boolean> {
    return toObservable(this._authStatus).pipe(
      filter((status) => status !== 'pending'),
      map((status) => status === 'authenticated'),
      take(1)
    )
  }

  /**
   * Attempts to authenticate the user using email/password.
   *
   * On success:
   * - Updates auth state
   * - Stores user and token
   *
   * On error:
   * - Clears auth state
   *
   * @param email User email
   * @param password User password
   */
  login(email: string, password: string): Observable<AuthStoreResult> {
    return this.http.post<AuthResponseData>(`${api_url}/auth/login`, { email, password }).pipe(
      map((res) => this.handleAuthSuccess(res)),
      catchError((err) => this.handleAuthError(err))
    )
  }

  /**
   * Registers a new user and authenticates them.
   *
   * @param email User email
   * @param password User password
   * @param name User name object
   */
  register(
    email: string,
    password: string,
    name: { first: string; middle?: string; last: string }
  ): Observable<AuthStoreResult> {
    return this.http
      .post<AuthResponseData>(`${api_url}/auth/register`, {
        firstName: name.first,
        middleName: name.middle,
        lastName: name.last,
        email,
        password
      })
      .pipe(
        map((res) => this.handleAuthSuccess(res)),
        catchError((err) => this.handleAuthError(err))
      )
  }

  /**
   * Clears authentication state.
   *
   * - Sets status to `unauthenticated`
   * - Clears user and token
   * - Triggers token removal from localStorage via effect
   */
  logout(): void {
    this._authStatus.set('unauthenticated')
    this._token.set(null)
    this._user.set(null)
  }

  /**
   * Attempts to restore a session from localStorage.
   *
   * - If no token exists → logs out
   * - If token exists → validates it via `/auth/me`
   *
   * Interceptor credentials are disabled to avoid circular dependencies.
   */
  private checkLocalSession(): Observable<AuthStoreResult> {
    const token = localStorage.getItem('auth_token')

    if (!token) {
      this.logout()
      return of({ isAuthenticated: false, error: null })
    }

    return this.http
      .get<AuthResponseData>(`${api_url}/auth/me`, {
        context: new HttpContext().set(AUTH_HTTP_CREDENTIALS_INTERCEPTOR_DISABLED, true),
        headers: { authorization: `Bearer ${token}` }
      })
      .pipe(
        map((res) => this.handleAuthSuccess(res)),
        catchError((err) => this.handleAuthError(err))
      )
  }

  /**
   * Handles successful API authentication responses.
   *
   * @param response API response
   */
  private handleAuthSuccess(response: AuthResponseData): AuthStoreResult {
    if (response.status === 'error') {
      return { isAuthenticated: false, error: response.message }
    }

    this._authStatus.set('authenticated')
    this._user.set(response.data.user)
    this._token.set(response.data.token)

    return { isAuthenticated: true, error: null }
  }

  /**
   * Handles authentication errors.
   *
   * - Clears auth state
   * - Emits a normalized error result
   */
  private handleAuthError(error: any): Observable<AuthStoreResult> {
    this.logout()

    return of({
      isAuthenticated: false,
      error: error?.error?.message ?? error
    })
  }
}
