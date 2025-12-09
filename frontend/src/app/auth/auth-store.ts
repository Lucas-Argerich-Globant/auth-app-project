import { HttpClient, HttpContext } from '@angular/common/http'
import { computed, effect, inject, Injectable, signal } from '@angular/core'
import { catchError, map, of, tap } from 'rxjs'
import { AuthResponseData, AuthStatus, User } from './auth-types'
import { AUTH_HTTP_CREDENTIALS_INTERCEPTOR_DISABLED } from './auth-http-credentials'

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

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(`${api_url}/auth/login`, { email, password }).pipe(
      map((res) => this.handleAuthSuccess(res)),
      catchError((err) => this.handleAuthError(err))
    )
  }

  register(email: string, password: string, name: { first: string; middle?: string; last: string }) {
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
      return of(null)
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

  private handleAuthSuccess(response: AuthResponseData) {
    if (response.status === 'error') {
      return response.message
    }
    this._authStatus.set('authenticated')
    this._user.set(response.data.user)
    this._token.set(response.data.token)
    localStorage.setItem('auth_token', response.data.token)
    return null
  }

  private handleAuthError(error: any) {
    this.logout()
    console.log(error)
    return of(error?.error?.message ?? error)
  }
}
