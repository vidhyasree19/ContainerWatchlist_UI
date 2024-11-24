import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/login.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports:[ReactiveFormsModule,CommonModule],
  standalone:true
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const formData = this.loginForm.value;

    this.authService.authenticate(formData.email, formData.password).subscribe(
      (response) => {
        if (response) {
          this.authService.saveToken(response.token);  
          this.router.navigate(['/containers']); 
        }
      },
      (error) => {
        this.errorMessage = 'Invalid email or password.';
      }
    );
  }
  onRegister():void{
    this.router.navigate(['/register']);
  }
}
