import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KnobModule } from 'primeng/knob';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-knob',
  standalone: true,
  imports: [CommonModule, FormsModule, KnobModule],
  templateUrl: './knob.component.html'
})
export class KnobComponent {
  @Input() value: number = 0;
  @Input() label: string = '';
  @Input() size: number = 80;
  @Input() readonly: boolean = false; 
  @Input() min: number = 0;
  @Input() max: number = 100;
  @Input() step: number = 1;
  @Input() valueColor: string = 'var(--azul-500)';
  @Input() rangeColor: string = 'var(--fundo-100)';
  @Input() valueTemplate: string = '{value}%';
}