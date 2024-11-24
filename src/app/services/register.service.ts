import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  private apiUrl = 'http://localhost:5135/api/auth/register'; 

  constructor(private http: HttpClient) { }

  registerUser(registerData: { email: string, password: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, registerData);
  }
}
