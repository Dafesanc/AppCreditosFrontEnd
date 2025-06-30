import { Injectable } from '@angular/core';
import { appsettings } from '../../settings/appsettings';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  private baseUrl: string = appsettings.apiUrl; // Replace with your actual API base URL
  constructor(private http: HttpClient) { }


}
