import { Routes } from '@angular/router'
import { AuthComponent } from './auth/auth'
import { UnAuthenticatedRequired } from './auth/auth-required'

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    canMatch: [UnAuthenticatedRequired],
    loadChildren: () => import('./auth/auth-routes')
  }
]
