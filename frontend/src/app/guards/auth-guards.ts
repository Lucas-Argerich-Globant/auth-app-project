import { inject } from '@angular/core'
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router'
import { AuthStore } from '../services/auth-store'
import { firstValueFrom } from 'rxjs'

export const AuthenticatedRequired: CanMatchFn = async (route: Route, segments: UrlSegment[]) => {
  const authStore = inject(AuthStore)
  const router = inject(Router)

  const isAuthenticated = await firstValueFrom(authStore.isAuthenticated())

  if (!isAuthenticated) {
    return router.parseUrl('/auth/login')
  }

  return true
}

export const UnAuthenticatedRequired: CanMatchFn = async (route: Route, segments: UrlSegment[]) => {
  const authStore = inject(AuthStore)
  const router = inject(Router)

  const isAuthenticated = await firstValueFrom(authStore.isAuthenticated())

  if (isAuthenticated) {
    return router.parseUrl('/dashboard')
  }

  return true
}
