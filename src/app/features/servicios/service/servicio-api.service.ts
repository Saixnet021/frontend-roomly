import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Servicio } from '../model/servicio.model';
import { environment } from '../../../../environments/environment';


@Injectable({ providedIn: 'root' })
export class ServicioApiService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/api/servicios`;

  private headers(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });
  }

  getServicios(propertyId?: number): Observable<Servicio[]> {
    const params = propertyId ? `?propertyId=${propertyId}` : '';
    return this.http.get<Servicio[]>(`${this.api}${params}`, { headers: this.headers() });
  }

  createServicio(s: Partial<Servicio>): Observable<Servicio> {
    return this.http.post<Servicio>(this.api, s, { headers: this.headers() });
  }

  updateServicio(id: number, s: Partial<Servicio>): Observable<Servicio> {
    return this.http.put<Servicio>(`${this.api}/${id}`, s, { headers: this.headers() });
  }

  deleteServicio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`, { headers: this.headers() });
  }
}
