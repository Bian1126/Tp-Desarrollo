import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Person } from '../../services/person';
import { City } from '../../services/city';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-person',
  templateUrl: './add-person.html',
  styleUrls: ['./add-person.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AddPerson implements OnInit {
  location = inject(Location);
  volver() {
    this.location.back();
  }

  nombre = '';
  email = '';
  fechaNacimiento = '';
  city = '';
  ciudadesCordoba: any[] = [];
  error = '';

  constructor(
    private router: Router,
    private personService: Person,
    private cityService: City
  ) {}

  async ngOnInit() {
    try {
      this.ciudadesCordoba = await this.cityService.getCiudadesCordoba();
    } catch (e) {
      this.error = 'Error al cargar ciudades';
    }
  }

  async agregarPersona() {
    if (!this.nombre || !this.email || !this.fechaNacimiento || !this.city) {
      this.error = 'Completá todos los campos';
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        this.error = 'No estás autenticado';
        return;
      }

      let partes: string[] = [];
      if (this.fechaNacimiento.includes('/')) {
        partes = this.fechaNacimiento.split('/');
      } else if (this.fechaNacimiento.includes('-')) {
        partes = this.fechaNacimiento.split('-');
      }
      if (partes.length !== 3) {
        this.error = 'La fecha debe tener formato DD/MM/AAAA o DD-MM-AAAA';
        return;
      }

      const [dia, mes, anio] = partes;
      const birthDate = `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;

      const payload = {
        name: this.nombre,
        email: this.email,
        birthDate: birthDate, // ✅ usar el formato correcto
        city: { id: Number(this.city) },
      };


      await this.personService.agregarPersona(payload, token);

      this.router.navigate(['/person-list']);
    } catch (e: any) {
      console.error(e);
      this.error = 'Error al agregar persona';
    }
  }
}
