import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
    imports: [
    FormsModule,
    RouterLink 
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
  
})

export class Login {
  mostrarPassword = false;

  usuario = {
    email: '',
    password: ''
  };

  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  isRouteActive(route: string): boolean {
    return this.router.url === route;
  }

  login() {
    this.authService.loginNoTenant(this.usuario)
    .subscribe
    ({


      next: (res: any) => {

        if (res.token) {
          localStorage.setItem("token", res.token);
        }
        if (res.tenant) {
          localStorage.setItem("tenant", res.tenant);
          localStorage.setItem("role", res.role || 'PROPIETARIO');
          localStorage.setItem("userName", res.firstName || '');
          // Guardamos el nombre real de la empresa desde el backend
          const company = res.companyName || (res.tenant.charAt(0).toUpperCase() + res.tenant.slice(1));
          localStorage.setItem("companyName", company);
          this.router.navigate([`/${res.tenant}/dashboard`]);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },

      error: (err) => {
        console.error('Login error:', err);
        const backendError = err.error && (err.error.error || err.error.message) ? (err.error.error || err.error.message) : null;
        this.errorMessage = backendError || 'Usuario o contraseña incorrectos';
      }

    });

  }

}