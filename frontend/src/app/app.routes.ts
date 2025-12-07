import { Routes } from '@angular/router'
import { RegisterComponent } from './auth/register/register'
import { LoginComponent } from './auth/login/login'
import { AuthComponent } from './auth/auth'

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      {
        path: 'register',
        component: RegisterComponent,
        title: 'Register'
      },
      {
        path: 'login',
        component: LoginComponent,
        title: 'Login'
      },
      {
        path: '**',
        redirectTo: 'login'
      }
    ]
  }
]
