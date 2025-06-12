import { Injectable } from '@angular/core';
import { appsettings } from '../../settings/appsettings';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserUpdate } from '../../../Models/User';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private baseUrl: string = appsettings.apiUrl; // Replace with your actual API base URL
  constructor(private http: HttpClient) { }
  getUsers() {
    return this.http.get(`${this.baseUrl}/User/clients`, {
      headers: {
        'Authorization': `Bearer ${this.getToken()}`
      }
  }
  );
  }
  getUserById(id : string):Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/User/clients/${id}`, {
      headers: {
        'Authorization': `Bearer ${this.getToken()}`
      }
    });

  }
  updateUser(id: string, user: UserUpdate): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/User/clients/${id}`, user, {
      headers: {
        'Authorization': `Bearer ${this.getToken()}`
      }
    });
  }

  deleteUser(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/User/clients/${id}`, {
      headers: {
        'Authorization': `Bearer ${this.getToken()}`
      }
    });
  }

  private getToken(): string {
    return localStorage.getItem('token') || '';
  }

}
