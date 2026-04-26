import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {

  errorMessage: string = '';

  usuario: Usuario = {
    password: '',
    email: '',
    company: '',
    firstName: '',
    lastName: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  isRouteActive(route: string): boolean {
    return this.router.url === route;
  }

  registrar() {

    // Validamos que se envíe el nombre de empresa para el tenant
    if (!this.usuario.company || this.usuario.company.trim().length === 0) {
      this.errorMessage = 'Debe ingresar el nombre de su empresa para crear su sesión.';
      return;
    }

    // Enviamos datos puros de autenticación; todo se liga por el email y empresa.
    this.authService
      .register(this.usuario)
      .subscribe({

        next: (res: any) => {
          if (res.token) {
            // guardamos token
            localStorage.setItem("token", res.token);
          }

          if (res.tenant) {
            localStorage.setItem("tenant", res.tenant);
            // Navegamos al dashboard privado del tenant
            this.router.navigate([`/${res.tenant}/dashboard`]);
          } else {
            this.router.navigate(['/dashboard']);
          }

        },

        error: (err) => {
          console.error('Registro error:', err);
          const backendError = err.error && (err.error.error || err.error.message) ? (err.error.error || err.error.message) : null;
          this.errorMessage = backendError || 'Error al registrar';
        }

      });

  }

}
