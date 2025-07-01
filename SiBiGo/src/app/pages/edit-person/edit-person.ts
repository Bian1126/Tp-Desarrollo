import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import axios from 'axios';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-edit-person',
  templateUrl: './edit-person.html',
  styleUrls: ['./edit-person.css'],
  imports: [CommonModule, FormsModule]
})
export class EditPerson implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  location = inject(Location);

  nombre: string = '';
  email: string = '';
  fechaNacimiento: string = '';
  error: string = '';
  ciudadesCordoba: any[] = [];
  ciudadSeleccionada: string = '';
  idPersona: string = '';

  volver() {
    this.location.back();
  }
  
  async ngOnInit() {
    try {
      this.idPersona = this.route.snapshot.paramMap.get('id') || '';
      const token = localStorage.getItem('token');

      // 1. Traer datos de la persona (requiere token)
      const personaResp = await axios.get(
        `http://localhost:3001/person/${this.idPersona}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      this.nombre = personaResp.data.name;
      this.email = personaResp.data.email;
      this.fechaNacimiento = personaResp.data.birthDate;
      this.ciudadSeleccionada = personaResp.data.city.id;

      // 2. Traer ciudades desde endpoint público
      const ciudadesResp = await axios.get('http://localhost:3001/city/public');
      this.ciudadesCordoba = (ciudadesResp.data.items || []).filter(
        (c: any) => c.province?.name === 'Córdoba'
      );

    } catch (e) {
      console.error('Error en ngOnInit:', e);
      this.error = 'Error al cargar datos';
    }
  }

  async guardar() {
    try {
      const token = localStorage.getItem('token');

      await axios.patch(
        `http://localhost:3001/person/${this.idPersona}`,
        {
          name: this.nombre,
          email: this.email,
          birthDate: this.fechaNacimiento,
          cityId: this.ciudadSeleccionada
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      this.router.navigate(['/personal-info']);
    } catch (e) {
      console.error('Error al guardar:', e);
      this.error = 'Error al guardar datos';
    }
  }
}

  