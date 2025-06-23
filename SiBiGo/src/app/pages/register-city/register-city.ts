import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import axios from 'axios';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-city',
  imports: [FormsModule, CommonModule],
  templateUrl: './register-city.html',
  styleUrls: ['./register-city.css']
})
export class RegisterCity {
  router = inject(Router);

  nombre: string = '';
  provincia: string = '';
  pais: string = '';
  error: string = '';

  async registrarCiudad() {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3001/city', {
        name: this.nombre,
        province: this.provincia,
        country: this.pais
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      this.router.navigate(['/my-cities']);
    } catch (e) {
      this.error = 'Error al registrar ciudad';
    }
  }
}