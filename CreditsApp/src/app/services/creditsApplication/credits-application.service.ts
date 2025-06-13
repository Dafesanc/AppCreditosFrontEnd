import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { appsettings } from '../../settings/appsettings';
import { Observable } from 'rxjs';
import { CreditsApplications, CreateCreditsApplication, UpdateCreditsApplication } from '../../../Models/CreditsApplications';

@Injectable({
  providedIn: 'root'
})
export class CreditsApplicationService {

  private baseUrl: string = appsettings.apiUrl;

  constructor(private http: HttpClient) { }

  // Obtener todas las solicitudes de crédito (Solo para Analistas)
  getCreditsApplications(): Observable<CreditsApplications[]> {
    return this.http.get<CreditsApplications[]>(`${this.baseUrl}/CreditApplication`);
  }

  // Obtener mis solicitudes de crédito (Solo para Solicitantes)
  getMyCreditsApplications(): Observable<CreditsApplications[]> {
    return this.http.get<CreditsApplications[]>(`${this.baseUrl}/CreditApplication/my-applications`);
  }

  // Crear una nueva solicitud de crédito (Solo para Solicitantes)
  createCreditsApplication(application: CreateCreditsApplication): Observable<CreditsApplications> {
    return this.http.post<CreditsApplications>(`${this.baseUrl}/CreditApplication`, application);
  }

  // Actualizar estado de una solicitud de crédito (Solo para Analistas)
  updateCreditsApplicationStatus(id: number, status: number): Observable<CreditsApplications> {
    return this.http.put<CreditsApplications>(`${this.baseUrl}/CreditApplication/${id}/status`, { status });
  }
}
