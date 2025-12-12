import { inject } from '@angular/core'
import { CanMatchFn, Route, Router, UrlSegment, UrlTree } from '@angular/router'
import { AuthStore } from '../services/auth-store'
import { firstValueFrom } from 'rxjs'

/**
 * Route guard that requires the user to be authenticated.
 *
 * This guard:
 * - Resolves the current authentication state from {@link AuthStore}
 * - Allows route matching only if the user is authenticated
 * - Redirects unauthenticated users to the login page
 *
 * @param {Route} route The route configuration being matched
 * @param {UrlSegment[]} segments The URL segments of the attempted navigation
 * @returns {Promise<boolean | UrlTree>}
 * - `true` if the user is authenticated
 * - A `UrlTree` redirecting to `/auth/login` if not authenticated
 */
export const AuthenticatedRequired: CanMatchFn = async (route: Route, segments: UrlSegment[]): Promise<boolean | UrlTree> => {
  const authStore = inject(AuthStore)
  const router = inject(Router)

  const isAuthenticated = await firstValueFrom(authStore.isAuthenticated())

  if (!isAuthenticated) {
    return router.parseUrl('/auth/login')
  }

  return true
}

/**
 * Route guard that requires the user to be unauthenticated.
 *
 * This guard:
 * - Prevents authenticated users from accessing routes such as
 *   login or registration pages
 * - Redirects authenticated users to the dashboard
 *
 * @param {Route} route The route configuration being matched
 * @param {UrlSegment[]} segments The URL segments of the attempted navigation
 * @returns {Promise<boolean | UrlTree>}
 * - `true` if the user is not authenticated
 * - A `UrlTree` redirecting to `/dashboard` if authenticated
 */
export const UnAuthenticatedRequired: CanMatchFn = async (route: Route, segments: UrlSegment[]): Promise<boolean | UrlTree> => {
  const authStore = inject(AuthStore)
  const router = inject(Router)

  const isAuthenticated = await firstValueFrom(authStore.isAuthenticated())

  if (isAuthenticated) {
    return router.parseUrl('/dashboard')
  }

  return true
}
