import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Home } from './pages/home/home';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { PropiedadesComponent } from './pages/propiedades/propiedades';
import { InquilinosComponent } from './pages/inquilinos/inquilinos';
import { RoomsComponent } from './pages/rooms/rooms';
import { ServiciosComponent } from './pages/servicios/servicios';

import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: ':tenant/dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: ':tenant/propiedades', component: PropiedadesComponent, canActivate: [authGuard] },
  { path: ':tenant/propiedades/:id', component: RoomsComponent, canActivate: [authGuard] },
  { path: ':tenant/inquilinos', component: InquilinosComponent, canActivate: [authGuard] },
  { path: ':tenant/servicios', component: ServiciosComponent, canActivate: [authGuard] },
];