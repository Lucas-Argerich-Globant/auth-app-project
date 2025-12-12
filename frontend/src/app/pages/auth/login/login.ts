import { Component, inject } from '@angular/core'
import { Router } from '@angular/router'
import { AuthStore, LoginParams } from '../../../services/auth-store'
import { LoginForm } from './login-form/login-form'
import { Observable } from 'rxjs'

@Component({
  standalone: true,
  imports: [LoginForm],
  templateUrl: './login.html'
})
export class LoginComponent {
  private router = inject(Router)
  private authStore = inject(AuthStore)

  protected login = (...params: LoginParams): Observable<void> => {
    return new Observable((observer) => {
      this.authStore.login(...params).subscribe({
        next: ({ error }) => {
          if (error) {
            observer.error(error)
            return
          }

          this.router.navigateByUrl('/dashboard')
          observer.next()
          observer.complete()
        },
        error: (err) => observer.error(err)
      })
    })
  }
}
