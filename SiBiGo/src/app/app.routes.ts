import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterPerson } from './pages/register-person/register-person';
import { PersonalInfo } from './pages/personal-info/personal-info';
import { EditPerson } from './pages/edit-person/edit-person';
import { MyCities } from './pages/my-cities/my-cities';
import { RegisterCity } from './pages/register-city/register-city';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterPerson },
  { path: 'personal-info', component: PersonalInfo },
  { path: 'edit-person', component: EditPerson },
  { path: 'my-cities', component: MyCities },
  { path: 'add-city', component: RegisterCity },
  { path: '**', redirectTo: 'login' } // Redirección por si la ruta no existe
];