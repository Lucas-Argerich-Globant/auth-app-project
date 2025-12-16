import { Component, input, signal } from '@angular/core'
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms'
import { InputComponent } from '../../../../components/ui/input/input'
import { Observable } from 'rxjs'
import { LoginParams } from '../../../../services/auth-store'
import { HttpErrorResponse } from '@angular/common/http'

@Component({
  selector: 'login-form',
  standalone: true,
  imports: [InputComponent, ReactiveFormsModule],
  templateUrl: './login-form.html'
})
export class LoginForm {
  private formBuilder = new FormBuilder()

  protected isSubmitting = signal(false)
  protected errorMessage = signal<string | null>(null)

  login = input.required<(...params: LoginParams) => Observable<void>>()

  protected loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  })

  protected getControl(controlName: keyof typeof this.loginForm.controls): FormControl {
    return this.loginForm.get(controlName) as FormControl
  }

  protected onSubmit() {
    if (this.isSubmitting()) return
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched()
      return
    }

    this.isSubmitting.set(true)
    this.errorMessage.set(null)

    const { email, password } = this.loginForm.value

    this.login()(email!, password!).subscribe({
      error: (err) => {
        if (err instanceof Error) {
          this.errorMessage.set(err.message)
        }
        if (err instanceof HttpErrorResponse) {
          this.errorMessage.set('Error de conexión')
        }

        this.errorMessage.set(err)
        this.isSubmitting.set(false)
      },
      complete: () => {
        this.isSubmitting.set(false)
      }
    })
  }
}
