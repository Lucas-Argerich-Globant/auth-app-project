import { HttpContextToken, HttpHandlerFn, HttpRequest } from "@angular/common/http"
import { AuthStore } from "./auth-store"
import { inject } from "@angular/core"

export const AUTH_HTTP_CREDENTIALS_INTERCEPTOR_DISABLED = new HttpContextToken<boolean>(() => true);

export function authHttpCredentials(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  if (req.context.get(AUTH_HTTP_CREDENTIALS_INTERCEPTOR_DISABLED)) {
    return next(req)
  }

  const token = inject(AuthStore).token()
  console.log(token)

  if (!token) {
    return next(req)
  }

  const newReq = req.clone({
    headers: req.headers.append('authorization', `Bearer ${token}`)
  })
  return next(newReq)
}
