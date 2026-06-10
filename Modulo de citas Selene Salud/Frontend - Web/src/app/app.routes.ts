import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { MedicoDashboard } from './pages/medico-dashboard/medico-dashboard';

export const routes: Routes = [
  // Ruta por defecto: si entran a http://localhost:4200, les manda a /login automáticamente
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  // Páginas principales registradas
  { path: 'login', component: Login },
  { path: 'admin', component: AdminDashboard },
  { path: 'medico', component: MedicoDashboard },
  
  // Ruta comodín: si escriben cualquier cosa rara en la URL, los devuelve al login
  { path: '**', redirectTo: 'login' }
];