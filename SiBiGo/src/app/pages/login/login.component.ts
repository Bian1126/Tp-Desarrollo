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
  error: string = '';

  constructor(private authService: AuthService) {}

  async login() {
    try {
      const data = await this.authService.login(this.email, this.password);
      const token = data.accessToken;
      const decodedToken: any = jwtDecode(token);
      console.log('Token decodificado:', decodedToken);

      if (decodedToken.email === 'sibigoadmin@mail.com') {
        localStorage.setItem('token', token);
        this.router.navigate(['/person-list']);
      } else {
        this.error = 'Solo el administrador puede ingresar';
      }
    } catch (e: any) {
      this.error = 'Email o contraseña incorrectos';
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}