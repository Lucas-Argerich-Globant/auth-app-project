import { ComponentFixture, TestBed } from '@angular/core/testing'
import { InputComponent } from './input'
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms'
import { Component, signal, Type } from '@angular/core'
import { By } from '@angular/platform-browser'

@Component({
  template: `
    <app-input [control]="parentControl" [label]="label()" [type]="type()" [placeholder]="placeholder()"></app-input>
  `,
  standalone: true,
  imports: [InputComponent]
})
class TestHostComponent {
  parentControl = new FormControl('', Validators.required)
  label = signal('Username')
  type = signal('text')
  placeholder = signal('Enter your username')
}

describe('InputComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>
  let hostComponent: TestHostComponent
  let inputComponent: InputComponent
  let inputElement: HTMLInputElement

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, ReactiveFormsModule]
    }).compileComponents()

    hostFixture = TestBed.createComponent(TestHostComponent)
    hostComponent = hostFixture.componentInstance
    // Find the InputComponent instance
    inputComponent = hostFixture.debugElement.query(By.directive(InputComponent)).componentInstance

    hostFixture.detectChanges()

    // Find the actual input element in the DOM
    inputElement = hostFixture.debugElement.query(By.css('input')).nativeElement
  })

  // Helper function to trigger touch state
  const markAsTouched = () => {
    hostComponent.parentControl.markAsTouched()
    hostFixture.detectChanges()
  }

  // --- START OF NEW TESTS ---

  describe('Navigator/Interaction Tests', () => {
    // Test 1: Simulating Blur to set touched state
    it('should set FormControl to touched when input element blurs', () => {
      expect(hostComponent.parentControl.touched).toBe(false)

      // Act: Simulate a blur event on the native input element
      inputElement.dispatchEvent(new Event('blur'))
      hostFixture.detectChanges()

      expect(hostComponent.parentControl.touched).toBe(true)
    })

    // Test 2: Verifying ARIA attributes when required
    it('should set aria-required="true" when the required validator is present', () => {
      // Setup: Control is initialized with Validators.required
      hostFixture.detectChanges()

      expect(inputElement.getAttribute('aria-required')).toBe('true')
    })

    // Test 3: Verifying ARIA attributes when invalid
    it('should set aria-invalid="true" when control is invalid and touched', () => {
      // 1. Control is invalid (empty and required)
      expect(hostComponent.parentControl.invalid).toBe(true)

      // 2. Mark as touched (simulating a blur event)
      inputElement.dispatchEvent(new Event('blur'))
      hostFixture.detectChanges()

      expect(inputElement.getAttribute('aria-invalid')).toBe('true')
      expect(inputComponent.hasError()).toBe(true)
    })

    // Test 4: Verifying ARIA attributes when valid
    it('should NOT set aria-invalid when control is valid', () => {
      hostComponent.parentControl.setValue('valid@email.com')
      inputElement.dispatchEvent(new Event('blur'))
      hostFixture.detectChanges()

      expect(hostComponent.parentControl.valid).toBe(true)
      expect(inputElement.getAttribute('aria-invalid')).toBeNull()
      expect(inputComponent.hasError()).toBe(false)
    })
  })

  // --- END OF NEW TESTS ---

  it('should create the component', () => {
    expect(inputComponent).toBeTruthy()
  })

  // --- Input Binding Tests ---
  describe('Input Bindings', () => {
    // ... (Your existing Input Binding Tests)
    it('should pass the label text to the template', () => {
      // Assuming the template renders the label using a <label> tag
      const labelElement = hostFixture.debugElement.query(By.css('label'))
      // If the template is structured correctly, the label text should match
      if (labelElement) {
        expect(labelElement.nativeElement.textContent).toContain('Username')
      } else {
        // Fallback check if the template uses the label input internally
        expect(inputComponent.label()).toBe('Username')
      }
    })

    it('should set the input type correctly', () => {
      hostComponent.type.set('email')
      hostFixture.detectChanges()
      expect(inputElement.type).toBe('email')
      expect(inputComponent.type()).toBe('email')
    })

    it('should set the placeholder correctly', () => {
      expect(inputElement.placeholder).toBe('Enter your username')
      expect(inputComponent.placeholder()).toBe('Enter your username')
    })

    it('should bind the FormControl to the input', () => {
      const controlValue = 'test_value'
      hostComponent.parentControl.setValue(controlValue)
      hostFixture.detectChanges()
      expect(inputElement.value).toBe(controlValue)
      expect(inputComponent.control().value).toBe(controlValue)
    })
  })

  // --- Utility Method Tests ---
  describe('Utility Methods', () => {
    // ... (Your existing Utility Method Tests)
    it('required() should return true if Validators.required is present', () => {
      // Setup: parentControl is initialized with Validators.required
      expect(inputComponent.required()).toBe(true)
    })

    it('required() should return false if Validators.required is NOT present', () => {
      hostComponent.parentControl.clearValidators()
      hostComponent.parentControl.updateValueAndValidity()
      hostFixture.detectChanges()
      expect(inputComponent.required()).toBe(false)
    })

    it('hasError() should be false initially (untouched)', () => {
      expect(inputComponent.hasError()).toBe(false)
    })

    it('hasError() should be true when invalid and touched', () => {
      // 1. Control is invalid (it's empty and required)
      expect(hostComponent.parentControl.invalid).toBe(true)
      // 2. Mark as touched
      markAsTouched()

      expect(inputComponent.hasError()).toBe(true)
    })

    it('hasError() should be false when valid regardless of touch state', () => {
      hostComponent.parentControl.setValue('valid value')
      hostComponent.parentControl.markAsDirty()
      markAsTouched()

      expect(inputComponent.hasError()).toBe(false)
    })
  })

  // --- Error Message Logic Tests ---
  describe('errorMessage()', () => {
    // ... (Your existing Error Message Logic Tests)
    beforeEach(() => {
      // Ensure the component is ready to display errors
      markAsTouched()
      hostComponent.parentControl.setValue('') // Ensure it is invalid for required tests
    })

    it('should return null when control is valid', () => {
      hostComponent.parentControl.setValue('valid')
      expect(inputComponent.errorMessage()).toBeNull()
    })

    it('should return required error message', () => {
      // Control is empty and has Validators.required
      expect(inputComponent.errorMessage()).toBe('This field is required')
    })

    it('should return email error message', () => {
      hostComponent.parentControl.setValidators(Validators.email)
      hostComponent.parentControl.updateValueAndValidity()
      hostComponent.parentControl.setValue('not-an-email')
      expect(inputComponent.errorMessage()).toBe('Please enter a valid email address')
    })

    it('should return minlength error message', () => {
      hostComponent.parentControl.setValidators(Validators.minLength(5))
      hostComponent.parentControl.updateValueAndValidity()
      hostComponent.parentControl.setValue('123') // Length 3
      expect(inputComponent.errorMessage()).toBe('Minimum length is 5')
    })

    it('should return maxlength error message', () => {
      hostComponent.parentControl.setValidators(Validators.maxLength(5))
      hostComponent.parentControl.updateValueAndValidity()
      hostComponent.parentControl.setValue('123456') // Length 6
      expect(inputComponent.errorMessage()).toBe('Maximum length is 5')
    })

    it('should return min error message', () => {
      hostComponent.parentControl.setValidators(Validators.min(10))
      hostComponent.parentControl.updateValueAndValidity()
      hostComponent.parentControl.setValue('5')
      expect(inputComponent.errorMessage()).toBe('Minimum value is 10')
    })

    it('should return max error message', () => {
      hostComponent.parentControl.setValidators(Validators.max(10))
      hostComponent.parentControl.updateValueAndValidity()
      hostComponent.parentControl.setValue('15')
      expect(inputComponent.errorMessage()).toBe('Maximum value is 10')
    })

    it('should return pattern error message', () => {
      hostComponent.parentControl.setValidators(Validators.pattern(/^[A-Z]*$/))
      hostComponent.parentControl.updateValueAndValidity()
      hostComponent.parentControl.setValue('aB') // Must be all caps
      expect(inputComponent.errorMessage()).toBe('Invalid format')
    })

    it('should return custom mismatch error message', () => {
      // Mock a custom error object (e.g., from a password mismatch validator)
      hostComponent.parentControl.setErrors({ mismatch: true })
      expect(inputComponent.errorMessage()).toBe('Values do not match')
    })

    it('should prioritize the first error found', () => {
      // Set both minlength (5) and email errors
      hostComponent.parentControl.setValidators([Validators.minLength(5), Validators.email])
      hostComponent.parentControl.updateValueAndValidity()
      hostComponent.parentControl.setValue('a@') // Fails minlength (2) first, then email

      // MinLength is the first key in the errors object for this scenario (order matters)
      expect(inputComponent.errorMessage()).toBe('Minimum length is 5')
    })

    it('should return default message for unknown errors', () => {
      hostComponent.parentControl.setErrors({ customUnknownError: true })
      expect(inputComponent.errorMessage()).toBe('Invalid field')
    })
  })
})
