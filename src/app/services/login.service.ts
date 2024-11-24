import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:5135/api/auth/login'; // Replace with your actual API URL

  constructor(private http: HttpClient, private router: Router) { }

  // Authenticate the user by sending email and password to the API
  authenticate(email: string, password: string): Observable<any> {
    const authData = { email, password };
    return this.http.post<any>(this.apiUrl, authData, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
      .pipe(
        catchError(error => {
          console.error('Authentication error', error);
          throw error;
        })
      );
  }

  // Store JWT token in local storage or session storage
  saveToken(token: string): void {
    localStorage.setItem('jwtToken', token);
  }

  // Get the JWT token from local storage or session storage
  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  // Check if the user is logged in (based on the existence of a token)
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Log out the user by removing the token
  logout(): void {
    localStorage.removeItem('jwtToken');
    this.router.navigate(['/login']);
  }
}
