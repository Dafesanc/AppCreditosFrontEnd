import { Injectable } from '@angular/core';
import { appsettings } from '../../settings/appsettings';
import { HttpClient } from '@angular/common/http';
import { Account, approveAccount, CreateAccount } from '../../../Models/Account';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  private baseUrl: string = appsettings.apiUrl; // Replace with your actual API base URL
  constructor(private http: HttpClient) { }

  getAccounts(): Observable<Account[]> {
    return this.http.get<any>(`${this.baseUrl}/Accounts`, {
      headers: {
        'Authorization': `Bearer ${this.getToken()}`
      }
    }).pipe(
      map(response => {
        // Si la respuesta es directamente un array
        if (Array.isArray(response)) {
          return response;
        }
        // Si la respuesta es un objeto con una propiedad 'data'
        if (response && Array.isArray(response.data)) {
          return response.data;
        }
        // Si la respuesta es un objeto con otra estructura, intentar extraer el array
        if (response && typeof response === 'object') {
          // Buscar la primera propiedad que sea un array
          const arrayValues = Object.values(response).find(value => Array.isArray(value));
          if (arrayValues) {
            return arrayValues as Account[];
          }
        }
        // Si no encontramos un array, retornar array vacío
        console.warn('Respuesta del servidor no contiene un array válido:', response);
        return [];
      })
    );
  }
  createAccounts(account:CreateAccount): Observable<Account> {
    return this.http.post<any>(`${this.baseUrl}/Accounts`, account, {
      headers: {
        'Authorization': `Bearer ${this.getToken()}`
      }
    }).pipe(
      map(response => {

        // Si la respuesta es un objeto con una propiedad 'data'
        if (response && Array.isArray(response.data)) {
          return response.data;
        }
        // Si la respuesta es un objeto con otra estructura, intentar extraer el array
        // if (response && typeof response === 'object') {
        //   // Buscar la primera propiedad que sea un array
        //   const arrayValues = Object.values(response).find(value => Array.isArray(value));
        //   if (arrayValues) {
        //     return arrayValues as Account[];
        //   }
        // }
        if(response && typeof response.data === 'object' && response.data !== null){
          return response.data as Account;
        }
        // Si no encontramos un array, retornar array vacío
        console.warn('Respuesta del servidor no contiene un objeto valido:', response);
        return [];
      })
    );
  }
  getAccountById(id: string) {
    return this.http.get(`${this.baseUrl}/Accounts/${id}`, {
      headers: {
        'Authorization': `Bearer ${this.getToken()}`
      }
    });
  }

  updateAccount(id: string, account: approveAccount) {
    return this.http.put(`${this.baseUrl}/Accounts/${id}`, account, {
      headers: {
        'Authorization': `Bearer ${this.getToken()}`
      }
    });
  }

  deleteAccount(id: string) {
    return this.http.delete(`${this.baseUrl}/Accounts/${id}`, {
      headers: {
        'Authorization': `Bearer ${this.getToken()}`
      }
    });
  }

  getAccountsByUserId(userId: string): Observable<Account[]> {
    return this.http.get<any>(`${this.baseUrl}/Accounts/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${this.getToken()}`
      }
    }).pipe(
      map(response => {
        // Si la respuesta es directamente un array
        if (Array.isArray(response)) {
          return response;
        }
        // Si la respuesta es un objeto con una propiedad 'data'
        if (response && Array.isArray(response.data)) {
          return response.data;
        }
        // Si la respuesta es un objeto con otra estructura, intentar extraer el array
        if (response && typeof response === 'object') {
          // Buscar la primera propiedad que sea un array
          const arrayValues = Object.values(response).find(value => Array.isArray(value));
          if (arrayValues) {
            return arrayValues as Account[];
          }
        }
        // Si no encontramos un array, retornar array vacío
        console.warn('Respuesta del servidor no contiene un array válido:', response);
        return [];
      })
    );
  }
  getMyAccounts(): Observable<Account[]> {
    return this.http.get<any>(`${this.baseUrl}/Accounts/my-accounts`, {
      headers: {
        'Authorization': `Bearer ${this.getToken()}`
      }
    }).pipe(
      map(response => {
        // Si la respuesta es directamente un array
        if (Array.isArray(response)) {
          return response;
        }
        // Si la respuesta es un objeto con una propiedad 'data'
        if (response && Array.isArray(response.data)) {
          return response.data;
        }
        // Si la respuesta es un objeto con otra estructura, intentar extraer el array
        if (response && typeof response === 'object') {
          // Buscar la primera propiedad que sea un array
          const arrayValues = Object.values(response).find(value => Array.isArray(value));
          if (arrayValues) {
            return arrayValues as Account[];
          }
        }
        // Si no encontramos un array, retornar array vacío
        console.warn('Respuesta del servidor no contiene un array válido:', response);
        return [];
      })
    );
  }

  private getToken(): string {
    return localStorage.getItem('token') || '';
  }
}
