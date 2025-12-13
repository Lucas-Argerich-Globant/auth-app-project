import { Routes } from '@angular/router'
import { RegisterComponent } from './register/register'
import { LoginComponent } from './login/login'

export const routes: Routes = [
  {
    path: '',
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
