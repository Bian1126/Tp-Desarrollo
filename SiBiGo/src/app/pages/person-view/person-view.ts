import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Person } from '../../services/person';
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

  constructor(
    private route: ActivatedRoute,
    private personService: Person
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    try {
      const token = localStorage.getItem('token');
      this.person = await this.personService.getPerson(id!, token!);
    } catch (e) {
      this.error = 'Error al cargar persona';
    }
  }
}