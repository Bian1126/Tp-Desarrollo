import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
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

  // NUEVAS VARIABLES PARA PAGINACIÓN
  paginaActual: number = 0;
  elementosPorPagina: number = 4;

  constructor(private router: Router) {}

  async ngOnInit() {
    await this.cargarPersonas();
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
    } catch (e) {
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

  confirmarEliminar(persona: any) {
    this.personaAEliminar = persona;
    this.showModal = true;
  }

  async eliminarPersona() {
    if (!this.personaAEliminar) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/person/${this.personaAEliminar.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      this.showModal = false;
      this.personaAEliminar = null;
      alert('¡Persona eliminada exitosamente!');
      await this.cargarPersonas();
    } catch (e) {
      alert('Error al eliminar persona');
    }
  }

  cancelarEliminar() {
    this.showModal = false;
    this.personaAEliminar = null;
  }

  // 🔽 MÉTODOS PARA PAGINACIÓN
  personasPaginadas() {
    const inicio = this.paginaActual * this.elementosPorPagina;
    return this.persons.slice(inicio, inicio + this.elementosPorPagina);
  }

  totalPaginas() {
    return Math.ceil(this.persons.length / this.elementosPorPagina);
  }

  paginaSiguiente() {
    if (this.paginaActual < this.totalPaginas() - 1) {
      this.paginaActual++;
    }
  }

  paginaAnterior() {
    if (this.paginaActual > 0) {
      this.paginaActual--;
    }
  }
}
