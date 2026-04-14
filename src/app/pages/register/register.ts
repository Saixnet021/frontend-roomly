import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html'
})
export class Register {

  usuario: Usuario = {
    username: '',
    password: '',
    email: ''
  };

  constructor(private authService: AuthService) {}

  registrar() {

  this.authService
    .register(this.usuario)
    .subscribe({

      next: (res: any) => {

        alert(res.message || "Usuario registrado");

        if (res.token) {

          localStorage.setItem(
            "token",
            res.token
          );

        }

      },

      error: (err) => {

        console.log(err);

        alert(
          err.error?.error ||
          "Error al registrar"
        );

      }

    });

}

}
