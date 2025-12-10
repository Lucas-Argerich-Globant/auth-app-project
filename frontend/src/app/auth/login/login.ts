import { Component, inject, signal } from '@angular/core'
import { InputComponent } from '../../shared/ui/input/input'
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms'
import { AuthStore } from '../auth-store'
import { Router } from '@angular/router'

@Component({
  templateUrl: './login.html',
  imports: [InputComponent, ReactiveFormsModule]
})
export class LoginComponent {
  private router = inject(Router)
  private authStore = inject(AuthStore)
  private formBuilder = new FormBuilder()
  protected isSubmitting = signal(false)
  protected errorMessage = signal<string | null>(null)

  protected loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
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

    this.authStore.login(formData.email!, formData.password!).subscribe(({ error }) => {
      this.errorMessage.set(error)
      this.isSubmitting.set(false)
      this.router.navigateByUrl('/')
    })
  }
}
