import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room } from '../model/room.model';
import { ConfigService } from '../../../core/config.service';

@Injectable({ providedIn: 'root' })
export class RoomApiService {
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

  getRooms(propertyId: number): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiHost}/api/rooms?propertyId=${propertyId}`, { headers: this.getHeaders() });
  }

  createRoom(room: Partial<Room>): Observable<Room> {
    return this.http.post<Room>(`${this.apiHost}/api/rooms`, room, { headers: this.getHeaders() });
  }

  updateRoom(id: number, room: Partial<Room>): Observable<Room> {
    return this.http.put<Room>(`${this.apiHost}/api/rooms/${id}`, room, { headers: this.getHeaders() });
  }

  deleteRoom(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiHost}/api/rooms/${id}`, { headers: this.getHeaders() });
  }
}
