import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core'
import { provideRouter } from '@angular/router'

import { routes } from './app-routes'
import { provideHttpClient, withInterceptors } from '@angular/common/http'
import { authHttpCredentials } from './auth/auth-http-credentials'
import { JsonDateParser } from './json-date-parser'

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([JsonDateParser, authHttpCredentials]))
  ]
}
