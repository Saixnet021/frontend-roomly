import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
    imports: [
    FormsModule,
    RouterLink 
  ],
  templateUrl: './login.html'
  
})

export class Login {
  mostrarPassword = false;

  usuario = {
    email: '',
    password: ''
  };

  constructor(private authService: AuthService) {}

  login() {
    this.authService.login(this.usuario)
    .subscribe
    ({


      next: (res: any) => {

        alert(res.message || "Login exitoso");
        
        if (res.token) {
          localStorage.setItem(
            "token",
            res.token
          );
        }

      },

      error: (err) => {

        alert(err.error?.error || "Usuario o contraseña incorrectos");

      }

    });

  }

}