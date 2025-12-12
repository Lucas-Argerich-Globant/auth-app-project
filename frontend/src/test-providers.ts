import { ApplicationConfig } from '@angular/core'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'

const testProviders: ApplicationConfig['providers'] = [
  provideHttpClient(),
  provideHttpClientTesting()
]
export default testProviders
