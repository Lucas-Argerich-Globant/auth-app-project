import { HttpContextToken, HttpHandlerFn, HttpRequest } from '@angular/common/http'
import { inject } from '@angular/core'
import { AuthStore } from '../services/auth-store'

/**
 * Context token used to disable automatic credential injection
 * for specific HTTP requests.
 *
 * When set to `true`, the auth interceptor will skip adding
 * the Authorization header.
 */
export const AUTH_HTTP_CREDENTIALS_INTERCEPTOR_DISABLED = new HttpContextToken<boolean>(() => false)

/**
 * HTTP interceptor that conditionally attaches the Authorization header.
 *
 * Behavior:
 * - Reads the auth token from AuthStore
 * - Appends `Authorization: Bearer <token>` if a token exists
 * - Skips modification if explicitly disabled via HttpContext
 *
 * @param req Incoming HTTP request
 * @param next Next HTTP handler in the interceptor chain
 */
export function authHttpCredentials(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  // Explicit opt-out via HttpContext
  if (req.context.get(AUTH_HTTP_CREDENTIALS_INTERCEPTOR_DISABLED)) {
    return next(req)
  }

  // Retrieve current auth token from the store
  const token = inject(AuthStore).token()

  // Proceed unmodified if no token is available
  if (!token) {
    return next(req)
  }

  // Clone the request and attach the Authorization header
  const newReq = req.clone({
    headers: req.headers.append('authorization', `Bearer ${token}`)
  })

  return next(newReq)
}
