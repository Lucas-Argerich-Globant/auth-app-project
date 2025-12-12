import { HttpClient, HttpContext } from '@angular/common/http'
import { computed, effect, inject, Injectable, signal } from '@angular/core'
import { catchError, filter, map, Observable, of, take, tap } from 'rxjs'
import { AuthResponseData, AuthStatus, AuthStoreResult, User } from '../types/auth'
import { AUTH_HTTP_CREDENTIALS_INTERCEPTOR_DISABLED } from '../interceptors/auth-http-credentials'
import { toObservable } from '@angular/core/rxjs-interop'

const api_url = 'http://localhost:3000/api'

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private _authStatus = signal<AuthStatus>('pending')
  private _user = signal<User | null>(null)
  private _token = signal<string | null>(null)

  private http = inject(HttpClient)

  authStatus = computed(() => this._authStatus())
  user = computed(() => this._user())
  token = computed(() => this._token())

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

  isAuthenticated() {
    return toObservable(this._authStatus).pipe(
      filter((status) => status !== 'pending'),
      map((status) => status === 'authenticated'),
      take(1)
    )
  }

  login(email: string, password: string): Observable<AuthStoreResult> {
    return this.http.post<AuthResponseData>(`${api_url}/auth/login`, { email, password }).pipe(
      map((res) => this.handleAuthSuccess(res)),
      catchError((err) => this.handleAuthError(err))
    )
  }

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

  logout() {
    this._authStatus.set('unauthenticated')
    this._token.set(null)
    this._user.set(null)
  }

  private checkLocalSession() {
    const token = localStorage.getItem('auth_token')

    if (!token) {
      this.logout()
      return of({ isAuthenticated: false, error: null })
    }

    return this.http
      .get<AuthResponseData>(`${api_url}/auth/me`, {
        // Avoid Circular dependency
        context: new HttpContext().set(AUTH_HTTP_CREDENTIALS_INTERCEPTOR_DISABLED, true),
        headers: { authorization: `Bearer ${token}` }
      })
      .pipe(
        map((res) => this.handleAuthSuccess(res)),
        catchError((err) => this.handleAuthError(err))
      )
  }

  private handleAuthSuccess(response: AuthResponseData): AuthStoreResult {
    if (response.status === 'error') {
      return { isAuthenticated: false, error: response.message }
    }
    this._authStatus.set('authenticated')
    this._user.set(response.data.user)
    this._token.set(response.data.token)

    return { isAuthenticated: true, error: null }
  }

  private handleAuthError(error: any): Observable<AuthStoreResult> {
    this.logout()

    return of({ isAuthenticated: false, error: error?.error?.message ?? error })
  }
}
