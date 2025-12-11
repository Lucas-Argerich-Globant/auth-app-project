import { Routes } from '@angular/router'
import { AuthenticatedRequired, UnAuthenticatedRequired } from './auth/auth-required'

export const routes: Routes = [
  {
    path: 'auth',
    canMatch: [UnAuthenticatedRequired],
    loadChildren: () => import('./auth/auth-routes')
  },
  {
    path: 'dashboard',
    canMatch: [AuthenticatedRequired],
    loadComponent: () => import('./dashboard/dashboard').then((m) => m.Dashboard)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
]
