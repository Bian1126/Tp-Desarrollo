import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { PersonListComponent } from './pages/person-list/person-list';
import { PersonViewComponent } from './pages/person-view/person-view';
import {EditPerson} from './pages/edit-person/edit-person';
import { RegisterPerson } from './pages/register-person/register-person';
import { AddPerson } from './pages/add-person/add-person';
import { AuthGuard } from './services/auth.guard'; // Importa el guard

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'person-list', component: PersonListComponent, canActivate: [AuthGuard] },
  { path: 'person-view/:id', component: PersonViewComponent, canActivate: [AuthGuard] },
  { path: 'edit-person/:id', component: EditPerson, canActivate: [AuthGuard] },
  { path: 'register-person', component: RegisterPerson, },
  { path: 'add-person', component: AddPerson, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];