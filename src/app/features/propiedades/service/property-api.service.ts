import { environment } from '../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Property } from '../model/property.model';

@Injectable({
  providedIn: 'root'
})
export class PropertyApiService {

  private apiHost = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getProperties(): Observable<Property[]> {
    return this.http.get<Property[]>(`${this.apiHost}/api/properties`, { headers: this.getHeaders() });
  }

  createProperty(property: Partial<Property>): Observable<Property> {
    return this.http.post<Property>(`${this.apiHost}/api/properties`, property, { headers: this.getHeaders() });
  }

  updateProperty(id: number, property: Partial<Property>): Observable<Property> {
    return this.http.put<Property>(`${this.apiHost}/api/properties/${id}`, property, { headers: this.getHeaders() });
  }

  deleteProperty(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiHost}/api/properties/${id}`, { headers: this.getHeaders() });
  }

}
