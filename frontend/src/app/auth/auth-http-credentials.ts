import { HttpContextToken, HttpHandlerFn, HttpRequest } from "@angular/common/http"
import { AuthService } from "./auth-store"
import { inject } from "@angular/core"

export const AUTH_INTERCEPTOR_DISABLED = new HttpContextToken<boolean>(() => true);

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  if (req.context.get(AUTH_INTERCEPTOR_DISABLED)) {
    return next(req)
  }

  const token = inject(AuthService).token()
  console.log(token)

  if (!token) {
    return next(req)
  }

  const newReq = req.clone({
    headers: req.headers.append('authorization', `Bearer ${token}`)
  })
  return next(newReq)
}
