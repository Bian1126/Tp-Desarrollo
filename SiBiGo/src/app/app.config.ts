import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes'; // importa tus rutas

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes)
  ]
};