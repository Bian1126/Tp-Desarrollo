import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Person } from '../../services/person';
import { City } from '../../services/city';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-register-person',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register-person.html',
  styleUrls: ['./register-person.css']
})
export class RegisterPerson implements OnInit {
  router = inject(Router);
  location = inject(Location);

  nombre: string = '';
  email: string = '';
  fechaNacimiento: string = '';
  city: string = '';
  password: string = '';
  confirmPassword: string = ''; // variable para confirmar contraseña
  showPassword: boolean = false; // variable para mostrar/ocultar contraseña
  showConfirmPassword: boolean = false; // variable para mostrar/ocultar confirmación de contraseña
  error: string = '';
  ciudadesCordoba: any[] = [];

  modo: 'registro' | 'agregar' = 'registro';

  constructor(
    private personService: Person,
    private cityService: City
  ) {}

  volver() {
    this.location.back();
  }

  async ngOnInit() {
    try {
      this.ciudadesCordoba = await this.cityService.getCiudadesCordobaPublic();
    } catch (e) {
      console.error('Error al cargar ciudades:', e);
      this.error = 'Error al cargar ciudades';
    }
  }

  async registrar() {
    if (!this.nombre || !this.email || !this.fechaNacimiento || !this.city || !this.password || !this.confirmPassword) {
      this.error = 'Completá todos los campos';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    try {
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

      // 1. Registrar usuario en tp-JWT 
      await this.personService.registerUserJWTPublic(this.email, this.password);


      // 2. Registrar persona en tp-persona
      const payload = {
        name: this.nombre,
        email: this.email,
        birthDate,
        city: { id: Number(this.city) }
      };
      await this.personService.registerPublic(payload);

      alert('Persona registrada con éxito');
      this.router.navigate(['/login']);
    } catch (e: any) {
      if (e.message.includes('already exists')) {
        this.error = 'El correo electrónico ya está registrado.';
      } else {
        this.error = 'Error al registrar persona: ' + (e.message || '');
      }
      console.error(e);
    }
  }
}
