import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  {
    path: 'inicio', loadComponent:
     () => import('./components/inicio/inicio').then(c => c.Inicio)
  },
  {
    path: ':tipoMidia/:idMidia/detalhes', loadComponent:
     () => import('./components/detalhes-midia/detalhes-midia').then(d => d.DetalhesMidia)
  },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
  ]
};
