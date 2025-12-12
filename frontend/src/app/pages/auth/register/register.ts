import { Component, inject } from '@angular/core'
import { AuthStore, RegisterParams } from '../../../services/auth-store'
import { Router } from '@angular/router'
import { RegisterForm } from './register-form/register-form'
import { Observable } from 'rxjs'

@Component({
  templateUrl: './register.html',
  imports: [RegisterForm]
})
export class RegisterComponent {
  private router = inject(Router)
  private authStore = inject(AuthStore)

  protected register = (...params: RegisterParams): Observable<void> => {
    return new Observable((observer) => {
      this.authStore.register(...params).subscribe({
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
