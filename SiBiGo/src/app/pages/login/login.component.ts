import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import axios from 'axios';
import { CommonModule } from '@angular/common';

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

  async login() {
    try {
      const response = await axios.post('http://localhost:3000/login', { // <-- puerto 3000
        email: this.email,
        password: this.password
      });
      localStorage.setItem('token', response.data.token);
      this.router.navigate(['/personal-info']);
    } catch (e: any) {
      this.error = 'Email o contraseña incorrectos';
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}