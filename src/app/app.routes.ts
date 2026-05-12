import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DesignSystemComponent } from './pages/design-system/design-system';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Página inicial com os dois cards
  { path: 'design-system', component: DesignSystemComponent }, // Sua página atual de DS
  { path: '**', redirectTo: '' } // Fallback para a home
];