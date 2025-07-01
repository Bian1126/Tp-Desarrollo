import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';

@Component({
  selector: 'app-person-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './person-view.html',
  styleUrls: ['./person-view.css']
})
export class PersonViewComponent implements OnInit {
  
location = inject(Location);
volver() {
  this.location.back();
}
  person: any = null;
  error: string = '';

  constructor(private route: ActivatedRoute) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3001/person/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      this.person = response.data;
    } catch (e) {
      this.error = 'Error al cargar persona';
    }
  }
}