import { Component, inject, input, signal } from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms'
import { FormControlName } from '../../../../types/generics'
import { InputComponent } from '../../../../components/ui/input/input'
import { Observable } from 'rxjs'
import { RegisterParams } from '../../../../services/auth-store'
import { Router } from '@angular/router'

@Component({
  selector: 'register-form',
  imports: [InputComponent, ReactiveFormsModule],
  templateUrl: './register-form.html'
})
export class RegisterForm {
  private router = inject(Router)
  private formBuilder = new FormBuilder()

  protected formStep = signal<'name' | 'credentials'>('name')
  protected isSubmitting = signal(false)
  protected errorMessage = signal<string | null>(null)

  register = input.required<(...params: RegisterParams) => Observable<void>>()

  protected registerForm = this.formBuilder.group(
    {
      name: this.formBuilder.group({
        first: ['', [Validators.required]],
        middle: [''],
        last: ['', [Validators.required]]
      }),
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordPatternValidator()]],
      repeatPassword: ['', [Validators.required]]
    },
    { validators: this.passwordMatchValidator() }
  )

  private passwordPatternValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value

      const regex = /^(?=.*[0-9]).{8,}$/
      const valid = regex.test(password)

      if (!valid) {
        return { passwordpattern: true }
      }

      return null
    }
  }

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
  
  protected navigateToLogin() {
    this.router.navigateByUrl('auth/login')
  }

  protected goToStep(step: ReturnType<typeof this.formStep>) {
    this.formStep.set(step)
  }

  protected onSubmit() {
    if (this.isSubmitting()) return
    if (!this.registerForm.valid) return this.registerForm.markAllAsTouched()

    this.isSubmitting.set(true)
    this.errorMessage.set(null)

    const { email, password, name } = this.registerForm.value as {
      name: { first: string; middle?: string; last: string }
      email: string
      password: string
      repeatPassword: string
    }

    this.register()(email, password, name).subscribe({
      error: (err) => {
        this.errorMessage.set(err instanceof Error ? err.message : String(err))
        this.isSubmitting.set(false)
      },
      complete: () => {
        this.isSubmitting.set(false)
      }
    })
  }
}
