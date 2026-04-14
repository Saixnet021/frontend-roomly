import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  register(usuario: any) {

    return this.http.post(
      `${this.apiUrl}/register`,
      usuario
    );

  }

  login(credentials: any) {

    return this.http.post(
      `${this.apiUrl}/login`,
      credentials
    );

  }

}