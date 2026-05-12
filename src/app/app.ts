// src/app/app.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // Remova os componentes do DS daqui, pois agora estão no DesignSystemComponent
  templateUrl: './app.html',
})
export class AppComponent {
  // Esta classe fica praticamente vazia, servindo apenas de base
}