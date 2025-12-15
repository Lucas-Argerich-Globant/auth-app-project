import { Component, computed, input, signal } from '@angular/core'
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

  protected toggleState = signal(false)

  protected computedType = computed(() => {
    if (this.type() === 'password') {
      return this.toggleState() ? 'text' : 'password'
    }

    return this.type()
  })

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
        return 'Este campo es obligatorio'
      case 'email':
        return 'Por favor, ingrese una dirección de correo válida'
      case 'minlength':
        return `La longitud mínima es de ${errors['minlength'].requiredLength} ${errors['minlength'].requiredLength === 1 ? 'carácter' : 'caracteres'}`
      case 'maxlength':
        return `La longitud máxima es ${errors['maxlength'].requiredLength}`
      case 'min':
        return `El valor mínimo es ${errors['min'].min}`
      case 'max':
        return `El valor máximo es ${errors['max'].max}`
      case 'pattern':
        return 'Formato inválido'
      case 'passwordpattern':
        return 'La contraseña debe contener al menos un numero'
      case 'mismatch':
        return 'Los valores no coinciden'
      default:
        return 'Campo inválido'
    }
  }

  protected toggle() {
    this.toggleState.update((value) => !value)
  }
}
