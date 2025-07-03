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
    try {
      const token = localStorage.getItem('token');
      await this.personService.updatePerson(
        this.idPersona,
        {
          name: this.nombre,
          email: this.email,
          birthDate: this.fechaNacimiento,
          cityId: this.ciudadSeleccionada
        },
        token!
      );
      this.router.navigate(['/personal-info']);
    } catch (e) {
      console.error('Error al guardar:', e);
      this.error = 'Error al guardar datos';
    }
  }
}

  