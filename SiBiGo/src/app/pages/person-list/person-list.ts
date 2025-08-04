import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { Person } from '../../services/person'; 
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-person-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './person-list.html',
  styleUrls: ['./person-list.css']
})
export class PersonListComponent implements OnInit {
  persons: any[] = [];
  error: string = '';
  showModal: boolean = false;
  personaAEliminar: any = null;
  permisos: string[] = [];
  showSessionExpiredModal: boolean = false;

  // NUEVAS VARIABLES PARA PAGINACIÓN
  paginaActual: number = 0;
  elementosPorPagina: number = 4;

  constructor(private router: Router, private personService: Person) {}

  async ngOnInit() {
    await this.cargarPersonas();
    await this.cargarPermisos();
  }
  
  mensajeErrorSesionExpirada(e: any): boolean {
    if (e.response && e.response.status === 401) {
      alert('La sesión ha expirado. Por favor, inicie sesión nuevamente.');
      this.router.navigate(['/login']);
      return true; 
    }
    return false;
  }

  async cargarPermisos() {
    try {
      const token = localStorage.getItem('token');
      const resp = await axios.get('http://localhost:3000/my-permissions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      this.permisos = Array.isArray(resp.data) ? resp.data : resp.data.permissions;
    } catch (e: any) {
      this.mensajeErrorSesionExpirada(e);
      this.permisos = [];
    }
  }

  tienePermiso(permiso: string): boolean {
    return this.permisos.includes(permiso);
  }

  async cargarPersonas() {
    try {
      const token = localStorage.getItem('token');
      // Pedimos hasta 100 personas (podés aumentar el número si querés)
      const response = await axios.get('http://localhost:3001/person?page=1&quantity=100', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      this.persons = (response.data.items || []).sort((a: any, b: any) =>
        a.name.localeCompare(b.name)
      );
    } catch (e: any) {
      this.mensajeErrorSesionExpirada(e);
      this.error = 'Error al cargar personas'; 
    }
  }

  volver() {
    this.router.navigate(['/']);
  }

  goToAddPerson() {
    this.router.navigate(['/add-person']);
  }

  editarPersona(id: number) {
    this.router.navigate(['/edit-person', id]);
  }

  verPersona(id: number) {
    this.router.navigate(['/person-view', id]);
  }

  async confirmarEliminar(persona: any) {
    const token = localStorage.getItem('token');
    try {
      await axios.get('http://localhost:3000/my-permissions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      this.personaAEliminar = persona;
      this.showModal = true;
    } catch (e: any) {
      this.mensajeErrorSesionExpirada(e);
    }
  }

  async eliminarPersona() {
    if (!this.personaAEliminar) return;
    const token = localStorage.getItem('token');
    if (!token) {
      this.showSessionExpiredModal = true;
      return;
    }
    try {
      // Usamos el service person.ts para eliminar en ambos sistemas
      await this.personService.delete(this.personaAEliminar.id, token, this.personaAEliminar.email);
      this.showModal = false;
      this.personaAEliminar = null;
      alert('¡Persona eliminada exitosamente!');
      await this.cargarPersonas();
    } catch (e: any) {
      if (!this.mensajeErrorSesionExpirada(e)) {
        alert('Error al eliminar persona');
      }
    }
  }

  cancelarEliminar() {
    this.showModal = false;
    this.personaAEliminar = null;
  }

  // MÉTODOS PARA PAGINACIÓN
  personasPaginadas() {
    const inicio = this.paginaActual * this.elementosPorPagina;
    return this.persons.slice(inicio, inicio + this.elementosPorPagina);
  }

  totalPaginas() {
    return Math.ceil(this.persons.length / this.elementosPorPagina);
  }

  async paginaSiguiente() {
    if (this.paginaActual < this.totalPaginas() - 1) {
      const paginaAnterior = this.paginaActual;
      this.paginaActual++;
      try {
        await this.cargarPersonas();
      } catch (e: any) {
        this.paginaActual = paginaAnterior;
        this.mensajeErrorSesionExpirada(e);
      }
    }
  }

  async paginaAnterior() {
    if (this.paginaActual > 0) {
      const paginaAnterior = this.paginaActual;
      this.paginaActual--;
      try {
        await this.cargarPersonas();
      } catch (e: any) {
        this.paginaActual = paginaAnterior;
        this.mensajeErrorSesionExpirada(e);
      }
    }
  }
  
  redirigirLogin() {
    this.showSessionExpiredModal = false;
    this.router.navigate(['/login']);
  } 
}