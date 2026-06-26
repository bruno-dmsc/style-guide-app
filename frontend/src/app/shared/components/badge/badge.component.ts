import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseUIComponent } from '../base-ui.component'; // Importe caso use a classe base

type BadgeColor = 'default' | 'success' | 'warning' | 'danger' | 'help';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './badge.component.html'
})
export class BadgeComponent extends BaseUIComponent { // 'extends' opcional, dependendo de como usam
  @Input() color: BadgeColor = 'default'; // Ex: 'danger', 'success', 'warning', 'info'
  @Input() icon: string = ''; // Ex: 'pi pi-exclamation-triangle'
  @Input() variant: string = ''; // Ex: 'rounded', 'outlined' caso tenham essas variações
}