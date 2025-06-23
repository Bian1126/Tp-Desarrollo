import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import axios from 'axios';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-person',
  templateUrl: './edit-person.html',
  styleUrls: ['./edit-person.css'],
  imports: [CommonModule, FormsModule]
})
export class EditPerson implements OnInit {
  router = inject(Router);

  nombre: string = '';
  email: string = '';
  fechaNacimiento: string = '';
  error: string = '';

  async ngOnInit() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/person/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      this.nombre = response.data.name;
      this.email = response.data.email;
      this.fechaNacimiento = response.data.birthDate;
    } catch (e) {
      this.error = 'Error al cargar datos';
    }
  }

  async guardar() {
    try {
      const token = localStorage.getItem('token');
      await axios.patch('http://localhost:3001/person/me', {
        name: this.nombre,
        email: this.email,
        birthDate: this.fechaNacimiento
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      this.router.navigate(['/personal-info']);
    } catch (e) {
      this.error = 'Error al guardar datos';
    }
  }
}