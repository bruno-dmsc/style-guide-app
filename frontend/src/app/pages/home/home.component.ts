import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// Importando seus componentes do Design System
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    CardComponent,   // Selector: app-card
    ButtonComponent  // Selector: app-button
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent {}