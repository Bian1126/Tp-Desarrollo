import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Person } from '../../services/person';
import { City } from '../../services/city';
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
  emailOriginal: string = '';
  fechaNacimiento: string = '';
  error: string = '';
  ciudadesCordoba: any[] = [];
  ciudadSeleccionada: string = '';
  idPersona: string = '';

  constructor(
    private personService: Person,
    private cityService: City
  ) {}

  volver() {
    this.location.back();
  }
  
  async ngOnInit() {
    try {
      this.idPersona = this.route.snapshot.paramMap.get('id') || '';
      const token = localStorage.getItem('token');

      // 1. Traer datos de la persona (requiere token)
      const persona = await this.personService.getPerson(this.idPersona, token!);
      this.nombre = persona.name;
      this.email = persona.email;
      this.emailOriginal = persona.email; // Guardar email original para comparar
      this.fechaNacimiento = persona.birthDate;
      this.ciudadSeleccionada = persona.city.id;

      // 2. Traer ciudades desde endpoint público
      this.ciudadesCordoba = await this.cityService.getCiudadesCordobaPublic();

    } catch (e) {
      console.error('Error en ngOnInit:', e);
      this.error = 'Error al cargar datos';
    }
  }

  async guardar() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.error = 'No estás autenticado';
      this.router.navigate(['/login']);
      return;
    }
    try {
      // Actualizar en tp-persona
      await this.personService.updatePerson(
        this.idPersona,
        {
          name: this.nombre,
          email: this.email,
          birthDate: this.fechaNacimiento,
          cityId: Number(this.ciudadSeleccionada)
        },
        token!
      );

      // Si el email cambió, actualizar en tp-JWT
      if (this.email !== this.emailOriginal) {
        await this.personService.updateUserJWT(this.emailOriginal, { email: this.email }, token!);
      }

      this.error = 'Datos guardados correctamente';
      this.router.navigate(['/personal-list']);
    } catch (e: any) {
      if (e.response && (e.response.status === 401 || e.response.status === 403)) {
        this.error = 'Sesión expirada o permisos insuficientes';
        this.router.navigate(['/login']);
      } else {
        this.error = 'Error al guardar datos';
      }
    }
  }
}

  