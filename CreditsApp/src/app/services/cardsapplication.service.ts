import { Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CardApplication } from '../../Models/CardApplication';

// Interfaces para los DTOs de request
export interface CreateCardApplicationRequest {
  accountId: string;
  cardType: number; // 1 for Credit Card, 2 for Debit Card
  creditApplicationId: number;
}

export interface UpdateStatusRequest {
  status: number; // 0 for Pending, 1 for Approved, 2 for Rejected
}

// Interface para la respuesta estándar de la API
export interface ApiResponse<T> {
  errorCode: number;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class CardsapplicationService {

  private baseUrl: string = appsettings.apiUrl;

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // GET /api/CardApplications - Obtener todas las aplicaciones de tarjetas
  getAllCardApplications(): Observable<ApiResponse<CardApplication[]>> {
    return this.http.get<ApiResponse<CardApplication[]>>(
      `${this.baseUrl}/api/CardApplications`,
      { headers: this.getAuthHeaders() }
    );
  }

  // POST /api/CardApplications - Crear nueva aplicación de tarjeta
  createCardApplication(request: CreateCardApplicationRequest): Observable<ApiResponse<CardApplication>> {
    return this.http.post<ApiResponse<CardApplication>>(
      `${this.baseUrl}/api/CardApplications`,
      request,
      { headers: this.getAuthHeaders() }
    );
  }

  // GET /api/CardApplications/{id} - Obtener aplicación por ID
  getCardApplicationById(id: string): Observable<ApiResponse<CardApplication>> {
    return this.http.get<ApiResponse<CardApplication>>(
      `${this.baseUrl}/api/CardApplications/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // DELETE /api/CardApplications/{id} - Eliminar aplicación
  deleteCardApplication(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(
      `${this.baseUrl}/api/CardApplications/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // GET /api/CardApplications/user/{userId} - Obtener aplicaciones por usuario
  getCardApplicationsByUserId(userId: string): Observable<ApiResponse<CardApplication[]>> {
    return this.http.get<ApiResponse<CardApplication[]>>(
      `${this.baseUrl}/api/CardApplications/user/${userId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // GET /api/CardApplications/my-applications - Obtener mis aplicaciones
  getMyCardApplications(): Observable<ApiResponse<CardApplication[]>> {
    return this.http.get<ApiResponse<CardApplication[]>>(
      `${this.baseUrl}/api/CardApplications/my-applications`,
      { headers: this.getAuthHeaders() }
    );
  }

  // POST /api/CardApplications/apply-with-sp - Aplicar con stored procedure
  applyWithStoredProcedure(request: CreateCardApplicationRequest): Observable<ApiResponse<CardApplication>> {
    return this.http.post<ApiResponse<CardApplication>>(
      `${this.baseUrl}/api/CardApplications/apply-with-sp`,
      request,
      { headers: this.getAuthHeaders() }
    );
  }

  // PUT /api/CardApplications/{id}/status - Actualizar estado de aplicación
  updateCardApplicationStatus(id: string, status: number): Observable<ApiResponse<CardApplication>> {
    const request: UpdateStatusRequest = { status };
    return this.http.put<ApiResponse<CardApplication>>(
      `${this.baseUrl}/api/CardApplications/${id}/status`,
      request,
      { headers: this.getAuthHeaders() }
    );
  }

  // POST /api/CardApplications/{id}/approve - Aprobar aplicación
  approveCardApplication(id: string): Observable<ApiResponse<CardApplication>> {
    return this.http.post<ApiResponse<CardApplication>>(
      `${this.baseUrl}/api/CardApplications/${id}/approve`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  // Métodos auxiliares para facilitar el uso

  // Crear aplicación de tarjeta de crédito
  createCreditCardApplication(accountId: string, creditApplicationId: number = 0): Observable<ApiResponse<CardApplication>> {
    const request: CreateCardApplicationRequest = {
      accountId,
      cardType: 1, // Credit Card
      creditApplicationId
    };
    return this.createCardApplication(request);
  }

  // Crear aplicación de tarjeta de débito
  createDebitCardApplication(accountId: string): Observable<ApiResponse<CardApplication>> {
    const request: CreateCardApplicationRequest = {
      accountId,
      cardType: 2, // Debit Card
      creditApplicationId: 0
    };
    return this.createCardApplication(request);
  }

  // Aprobar aplicación (método de conveniencia)
  approve(id: string): Observable<ApiResponse<CardApplication>> {
    return this.approveCardApplication(id);
  }

  // Rechazar aplicación (método de conveniencia)
  reject(id: string): Observable<ApiResponse<CardApplication>> {
    return this.updateCardApplicationStatus(id, 2); // 2 = Rejected
  }

  // Marcar como pendiente (método de conveniencia)
  setPending(id: string): Observable<ApiResponse<CardApplication>> {
    return this.updateCardApplicationStatus(id, 0); // 0 = Pending
  }
}
