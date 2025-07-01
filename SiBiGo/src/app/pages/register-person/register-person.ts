import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import axios from 'axios';
import { CommonModule, Location } from '@angular/common';
import { ParenthesizedExpr } from '@angular/compiler';

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
  error: string = '';
  ciudadesCordoba: any[] = [];

  modo: 'registro' | 'agregar' = 'registro';

  volver() {
    this.location.back();
  }

  async ngOnInit() {
    try {
      const response = await axios.get('http://localhost:3001/city/public');
      this.ciudadesCordoba = (response.data.items || []).filter(
        (c: any) => c.province?.name === 'Córdoba'
      );
    } catch (e) {
      console.error('Error al cargar ciudades:', e);
      this.error = 'Error al cargar ciudades';
    }
  }

  async registrar() {
    if (!this.nombre || !this.email || !this.fechaNacimiento || !this.city) {
      this.error = 'Completá todos los campos';
      return;
    }

    try {
      // Permitir tanto / como - como separador
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
        birthDate,
        city: { id: Number(this.city) } // en lugar de cityId
        };


      console.log('Payload enviado:', payload);

      await axios.post('http://localhost:3001/person/public', payload);
      this.router.navigate(['/']);
    } catch (e: any) {
      console.error(e);
      this.error = 'Error al registrar persona';
    }
  }
}
