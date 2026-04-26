import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Inquilino } from '../model/inquilino.model';
import { ConfigService } from '../../../core/config.service';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InquilinoApiService {
  private http = inject(HttpClient);
  private config = inject(ConfigService);
  private get apiHost() { return this.config.apiUrl; }

  constructor() {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }

  getInquilinos(): Observable<Inquilino[]> {
    return this.http.get<any[]>(`${this.apiHost}/api/inquilinos`, { headers: this.getHeaders() })
      .pipe(
        map((arr: any[]) => arr
          .map(i => this.normalize(i))
          .filter((x): x is Inquilino => !!x)
        )
      );
  }

  getMyInfo(): Observable<Inquilino | null> {
    return this.http.get<any>(`${this.apiHost}/api/inquilinos/me`, { headers: this.getHeaders() })
      .pipe(map((i: any) => this.normalize(i)));
  }

  private normalize(i: any): Inquilino | null {
    if (!i) return null;
    return {
      id: i.id,
      name: i.name || i.fullName || i.first_name || '',
      document: i.document || i.documento || '',
      email: i.email || '',
      phone: i.phone || i.telefono || '',
      status: i.status || i.estado || '',
      propertyId: i.propertyId ?? i.property_id ?? i.property,
      propertyName: i.propertyName ?? i.property_name ?? i.property,
      roomId: i.roomId ?? i.room_id ?? undefined,
      roomNumber: i.roomNumber || i.room_number || i.room || undefined,
      password: i.password || undefined
    } as Inquilino;
  }

  createInquilino(inquilino: Partial<Inquilino>): Observable<Inquilino> {
    return this.http.post<Inquilino>(`${this.apiHost}/api/inquilinos`, inquilino, { headers: this.getHeaders() });
  }

  updateInquilino(id: number, inquilino: Partial<Inquilino>): Observable<Inquilino> {
    return this.http.put<Inquilino>(`${this.apiHost}/api/inquilinos/${id}`, inquilino, { headers: this.getHeaders() });
  }

  deleteInquilino(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiHost}/api/inquilinos/${id}`, { headers: this.getHeaders() });
  }
}
