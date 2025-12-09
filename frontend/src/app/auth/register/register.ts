import { Component, inject, signal } from '@angular/core'
import { InputComponent } from '../../shared/ui/input/input'
import { AbstractControl, FormBuilder, FormControl, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms'
import { AuthStore } from '../auth-store'
import { FormControlName } from '../../types/generics'

@Component({
  templateUrl: './register.html',
  imports: [InputComponent, ReactiveFormsModule]
})
export class RegisterComponent {
  private authService = inject(AuthStore)
  private formBuilder = new FormBuilder()
  protected isSubmitting = signal(false)
  protected errorMessage = signal<string | null>(null)

  protected registerForm = this.formBuilder.group(
    {
      name: this.formBuilder.group({
        first: ['', [Validators.required]],
        middle: [''],
        last: ['', [Validators.required]]
      }),
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[0-9]).{8,}$/)]],
      repeatPassword: ['', [Validators.required]]
    },
    { validators: this.passwordMatchValidator() }
  )

  private passwordMatchValidator(): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: any } | null => {
      const passwordControl = formGroup.get('password')!
      const confirmPasswordControl = formGroup.get('repeatPassword')!

      if (confirmPasswordControl.errors && !confirmPasswordControl.errors['mismatch']) {
        return null // Other errors already exist on confirmPassword, don't overwrite
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ mismatch: true })
        return { mismatch: true }
      } else {
        confirmPasswordControl.setErrors(null) // Clear mismatch error if they match
        return null
      }
    }
  }

  protected getControl(controlName: FormControlName<typeof this.registerForm>): FormControl {
    return this.registerForm.get(controlName) as FormControl
  }

  protected onSubmit() {
    if (this.isSubmitting()) return
    if (!this.registerForm.valid) return this.registerForm.markAllAsTouched()

    this.isSubmitting.set(true)
    this.errorMessage.set(null)

    const formData = this.registerForm.value as {
      name: { first: string; middle?: string; last: string }
      email: string
      password: string
      repeatPassword: string
    }

    this.authService.register(formData.email, formData.password, formData.name).subscribe((message) => {
      this.errorMessage.set(message)
      this.isSubmitting.set(false)
    })
  }
}
