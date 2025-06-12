import { Login } from './../../../Models/Login';
import { register } from './../../../Models/Register';
import { Injectable } from '@angular/core';
import { appsettings } from '../../settings/appsettings';
import { HttpClient } from '@angular/common/http';
import { LoginResponse } from '../../../Models/LoginResponse';
import { Observable } from 'rxjs';
import { UserLoged } from '../../../Models/UserLoged';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = appsettings.apiUrl; // Replace with your actual API base URL
  constructor(private http: HttpClient) { }
  registrarse(usuario: register): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/Auth/register`, usuario);
  }login(usuario: Login): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/Auth/login`, usuario)
  }
  logout(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/Auth/logout`, {}, {
      headers: {
        'Authorization': `Bearer ${this.getToken()}`
      }
    });
  }  getLogedUserInfo():Observable<UserLoged>{
    return this.http.get<UserLoged>(`${this.baseUrl}/Auth/user-info`, {
      headers: {
        'Authorization': `Bearer ${this.getToken()}`
      }
  });
}
  getToken(): string {
    return localStorage.getItem('token') || sessionStorage.getItem('token') || '';
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }


}
