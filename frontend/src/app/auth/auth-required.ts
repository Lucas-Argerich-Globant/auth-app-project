import { inject } from '@angular/core'
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router'
import { AuthStore } from './auth-store'
import { firstValueFrom } from 'rxjs'

export const AuthenticatedRequired: CanMatchFn = async (route: Route, segments: UrlSegment[]) => {
  const authStore = inject(AuthStore)

  const { isAuthenticated } = await firstValueFrom(authStore.checkLocalSession())

  return isAuthenticated
}

export const UnAuthenticatedRequired: CanMatchFn = async (route: Route, segments: UrlSegment[]) => {
  const authStore = inject(AuthStore)
  const router = inject(Router)

  const { isAuthenticated } = await firstValueFrom(authStore.checkLocalSession())

  if (isAuthenticated) {
    router.navigateByUrl('/')
    return false
  }

  return true
}
