import { Routes } from '@angular/router'
import { AuthenticatedRequired, UnAuthenticatedRequired } from './guards/auth-required'

export const routes: Routes = [
  {
    path: 'auth',
    canMatch: [UnAuthenticatedRequired],
    loadChildren: () => import('./pages/auth/auth.routes')
  },
  {
    path: 'dashboard',
    canMatch: [AuthenticatedRequired],
    loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
]
