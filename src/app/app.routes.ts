import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DesignSystemComponent } from './pages/design-system/design-system';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Página inicial com os dois cards
  { path: 'design-system', component: DesignSystemComponent }, // Sua página atual de DS
  { path: 'dashboard', component: DashboardComponent },
  { path: '**', redirectTo: '' } // Fallback para a home
];