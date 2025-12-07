import { HttpClient } from '@angular/common/http'
import { computed, effect, inject, Injectable, signal } from '@angular/core'
import { catchError, map, of, tap } from 'rxjs'
import { AuthResponseData, AuthStatus, User } from './types'

const api_url = 'http://localhost:3000/api'

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authStatus = signal<AuthStatus>('pending')
  private _user = signal<User | null>(null)
  private _token = signal<string | null>(null)

  private http = inject(HttpClient)

  authStatus = computed(() => this._authStatus())
  user = computed(() => this._user())
  token = computed(() => this._token())

  private storageEffect = effect(() => {
    const token = this._token()
    if (token) {
      cookieStore.set('auth_token', token)
    } else {
      cookieStore.delete('auth_token')
    }
  })

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(`${api_url}/auth/login`, { email, password }).pipe(
      tap((response) => {
        if (response.status === 'error') {
          throw new Error(response.message)
        }

        this._authStatus.set('authenticated')
        this._user.set(response.data.user)
        this._token.set(response.data.token)
      }),
      map((response) => response.status === 'success'),
      catchError((error) => {
        this._authStatus.set('unauthenticated')
        this._user.set(null)
        this._token.set(null)

        return of(false)
      })
    )
  }
}
