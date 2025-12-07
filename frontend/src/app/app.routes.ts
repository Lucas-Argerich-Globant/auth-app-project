import { Routes } from '@angular/router'
import { RegisterComponent } from './auth/register/register'
import { LoginComponent } from './auth/login/login'

export const routes: Routes = [
  {
    path: 'auth',
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
      }
    ]
  }
]
