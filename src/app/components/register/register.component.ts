import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegistrationService } from '../../services/register.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registration',
  templateUrl: './register.component.html',
  standalone:true,
  imports:[ReactiveFormsModule,CommonModule],
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
    this.registrationForm = this.fb.group({
      username:['',Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() {
    return this.registrationForm.controls;
  }

  onSubmit() {
    if (this.registrationForm.invalid) {
      return;
    }

    const formData = this.registrationForm.value;

    this.registrationService.registerUser(formData).subscribe(
      (response) => {
        this.successMessage = response; 
        setTimeout(() => {
          this.router.navigate(['/login']); 
        }, 2000);
      },
      (error) => {
        if (error.status === 409) {
          this.errorMessage = 'User already exists!';
        } else if (error.status === 400) {
          this.errorMessage = 'Invalid form data. Please check your input.';
        } else {
          this.errorMessage = 'An unexpected error occurred.';
        }
      }
    );
  }
  onLogin():void{
    this.router.navigate(['/login']);
  }
}
