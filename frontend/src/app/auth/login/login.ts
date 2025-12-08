import { Component, inject, signal } from '@angular/core'
import { InputComponent } from '../../components/ui/input/input'
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms'
import { AuthService } from '../../services/auth'

@Component({
  templateUrl: './login.html',
  imports: [InputComponent, ReactiveFormsModule]
})
export class LoginComponent {
  private authService = inject(AuthService)
  private formBuilder = new FormBuilder()
  protected isSubmitting = signal(false)
  protected errorMessage = signal<string | null>(null)

  protected loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
    // Validators for register:
    //password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[0-9]).{8,}$/)]]
  })

  protected getControl(controlName: keyof typeof this.loginForm.controls): FormControl {
    return this.loginForm.get(controlName) as FormControl
  }

  protected onSubmit() {
    if (this.isSubmitting()) return
    if (!this.loginForm.valid) return this.loginForm.markAllAsTouched()

    this.isSubmitting.set(true)
    this.errorMessage.set(null)

    const formData = this.loginForm.value

    this.authService.login(formData.email!, formData.password!).subscribe((message) => {
      this.errorMessage.set(message)
      this.isSubmitting.set(false)
    })
  }
}
