import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegistrationService } from '../../services/register.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registration',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./register.component.css']
})
export class RegistrationComponent {
  registrationForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private registrationService: RegistrationService,
    private router: Router
  ) {
    // Initialize the registration form with validation rules
    this.registrationForm = this.fb.group({
      username: ['', Validators.required], // Username is required
      email: ['', [Validators.required, Validators.email]], // Email is required and must be valid
      password: [
        '', 
        [
          Validators.required, 
          Validators.minLength(6), 
          this.passwordStrengthValidator
        ]
      ] // Password is required and must be at least 6 characters long with additional custom validation
    });
  }

  // Get a reference to form controls for easier access
  get f() {
    return this.registrationForm.controls;
  }

  // Custom password strength validator
  passwordStrengthValidator(control: any) {
    const value = control.value;

    // Password must contain at least one uppercase letter
    if (!/[A-Z]/.test(value)) {
      return { passwordStrength: 'Password must contain at least one uppercase letter.' };
    }

    // Password must contain at least one number
    if (!/[0-9]/.test(value)) {
      return { passwordStrength: 'Password must contain at least one number.' };
    }

    // Password must contain at least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      return { passwordStrength: 'Password must contain at least one special character.' };
    }

    // If all checks are passed, return null (no validation error)
    return null;
  }

  // Method to handle form submission
  onSubmit() {
    if (this.registrationForm.invalid) {
      return; // Do nothing if the form is invalid
    }

    const formData = this.registrationForm.value;

    // Call the registration service to submit the form data
    this.registrationService.registerUser(formData).subscribe(
      (response) => {
        // Handle successful registration
        this.successMessage = 'Registration successful! Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['/login']); // Navigate to the login page after 2 seconds
        }, 2000);
      },
      (error) => {
        // Handle errors based on the HTTP status code
        if (error.status === 409) {
          this.errorMessage = 'User already exists! Please use a different username or email.';
        } else if (error.status === 400) {
          this.errorMessage = 'Invalid form data. Please check your input and try again.';
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again later.';
        }
      }
    );
  }

  // Navigate to the login page if the user wants to log in instead
  onLogin(): void {
    this.router.navigate(['/login']);
  }
}
