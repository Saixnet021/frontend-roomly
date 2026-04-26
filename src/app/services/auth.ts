import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // host base sin path
  private apiHost = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Construye la URL prefijando el tenant almacenado en localStorage (si existe).
  private buildUrl(path: string) {
    const tenant = localStorage.getItem('tenant');
    // si existe tenant lo ponemos como primer segmento: /{tenant}/api/auth/...
    const prefix = tenant ? `/${tenant}` : '';
    return `${this.apiHost}${prefix}${path}`; // path debe comenzar con /api/...
  }

  register(usuario: any, noTenantPrefix: boolean = false) {
    const url = noTenantPrefix ? `${this.apiHost}/api/auth/register` : this.buildUrl('/api/auth/register');
    return this.http.post(url, usuario);
  }

  login(credentials: any) {
    return this.http.post(
      this.buildUrl('/api/auth/login'),
      credentials
    );
  }

  loginNoTenant(credentials: any) {
    return this.http.post(
      `${this.apiHost}/api/auth/login`,
      credentials
    );
  }

}