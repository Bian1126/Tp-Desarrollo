import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import axios from 'axios';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-person',
  imports: [FormsModule, CommonModule],
  templateUrl: './register-person.html',
  styleUrls: ['./register-person.css']
})
export class RegisterPerson implements OnInit {
  router = inject(Router);

  nombre: string = '';
  email: string = '';
  fechaNacimiento: string = '';
  city: string = '';
  error: string = '';
  ciudadesCordoba: any[] = [];

  async ngOnInit() {
    try {
      const response = await axios.get('http://localhost:3001/city');
      // Filtra solo ciudades de Córdoba
      this.ciudadesCordoba = (response.data.items || []).filter(
        (c: any) => c.province?.name === 'Córdoba'
      );
    } catch (e) {
      this.error = 'Error al cargar ciudades';
    }
  }

  async registrar() {
    try {
      await axios.post('http://localhost:3001/person', {
        name: this.nombre,
        email: this.email,
        birthDate: this.fechaNacimiento,
        city: this.city
      });
      this.router.navigate(['/']);
    } catch (e: any) {
      this.error = 'Error al registrar persona';
    }
  }
}