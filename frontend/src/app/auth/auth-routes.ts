import { Routes } from '@angular/router'
import { RegisterComponent } from './register/register'
import { LoginComponent } from './login/login'
import { AuthComponent } from './auth'

export const routes: Routes = [
  {
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

export default routes
