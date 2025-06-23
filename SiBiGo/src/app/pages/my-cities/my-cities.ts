import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import axios from 'axios';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-cities',
  templateUrl: './my-cities.html',
  styleUrls: ['./my-cities.css'],
  imports: [CommonModule]
})
export class MyCities implements OnInit {
  router = inject(Router);
  ciudades: any[] = [];

  async ngOnInit() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/city', {
        headers: { Authorization: `Bearer ${token}` }
      });
      this.ciudades = response.data.items || [];
    } catch (e) {
      this.ciudades = [];
    }
  }

  agregarCiudad() {
    this.router.navigate(['/add-city']);
  }
}