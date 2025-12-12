import { Component, input } from '@angular/core'
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms'

@Component({
  selector: 'app-input',
  templateUrl: './input.html',
  imports: [ReactiveFormsModule]
})
export class InputComponent {
  name = input('Name')
  type = input<HTMLInputElement['type']>('text')
  label = input('Label')
  placeholder = input('Placeholder')
  control = input<FormControl>(new FormControl(''))

  hasError() {
    return this.control().invalid && this.control().touched
  }

  required() {
    return this.control().hasValidator(Validators.required)
  }

  invalid() {
    return this.control().invalid
  }

  errorMessage() {
    const errors = this.control().errors
    if (!errors) {
      return null
    }
    switch (Object.keys(errors)[0]) {
      case 'required':
        return 'This field is required'
      case 'email':
        return 'Please enter a valid email address'
      case 'minlength':
        return `Minimum length is ${errors['minlength'].requiredLength}`
      case 'maxlength':
        return `Maximum length is ${errors['maxlength'].requiredLength}`
      case 'min':
        return `Minimum value is ${errors['min'].min}`
      case 'max':
        return `Maximum value is ${errors['max'].max}`
      case 'pattern':
        return 'Invalid format'
      case 'mismatch':
        return 'Values do not match'
      default:
        return 'Invalid field'
    }
  }
}
