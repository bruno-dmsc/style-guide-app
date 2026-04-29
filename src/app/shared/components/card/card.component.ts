import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necessário se usar Standalone Components

@Component({
  selector: 'app-card',
  standalone: true, // Assumindo Angular 17+ pelas configurações da sua imagem
  imports: [CommonModule],
  templateUrl: './card.component.html',
})
export class CardComponent {
  @Input() id: string = '';
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() icon: string = ''; // Nova propriedade para o ícone do PrimeNG
  @Input() showDivider: boolean = true;
}