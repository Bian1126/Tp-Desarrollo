import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import axios from 'axios';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.html',
  styleUrls: ['./personal-info.css']
  , imports: [CommonModule]
})
export class PersonalInfo implements OnInit {
volver() {
throw new Error('Method not implemented.');
}
  router = inject(Router);
  persona: any = {};

  async ngOnInit() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/person', {
        headers: { Authorization: `Bearer ${token}` }
      });
      this.persona = response.data;
    } catch (e) {
      this.persona = null;
    }
  }

  editar() {
    this.router.navigate(['/edit-person']);
  }

  verCiudades() {
    this.router.navigate(['/my-cities']);
  }
}