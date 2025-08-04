import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  router = inject(Router);

  email: string = '';
  password: string = '';
  showPassword: boolean = false; // variable para mostrar/ocultar contraseña
  error: string = '';

  constructor(private authService: AuthService) {}

  async login() {
  try {
    const data = await this.authService.login(this.email, this.password);
    const token = data.accessToken;
    localStorage.setItem('token', token);

    // Opcional: guardar el usuario decodificado para usar en otros componentes
    const decodedToken: any = jwtDecode(token);
    localStorage.setItem('user', JSON.stringify(decodedToken));

    this.router.navigate(['/person-list']);
  } catch (e: any) {
    this.error = 'Email o contraseña incorrectos';
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}