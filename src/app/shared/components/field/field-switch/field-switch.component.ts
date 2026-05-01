import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';
import { BaseFieldComponent } from '../base-field.component';

@Component({
  selector: 'app-field-switch',
  standalone: true,
  imports: [CommonModule, FormsModule, InputSwitchModule],
  templateUrl: './field-switch.component.html'
})
export class FieldSwitchComponent extends BaseFieldComponent {
  @Input() value: boolean = false;
  
  @Output() valueChange = new EventEmitter<boolean>();

  // Usamos um ID gerado aleatoriamente para garantir que o clique na label
  // sempre ative o switch correspondente, mesmo com vários na tela
  switchId: string = 'switch-' + Math.random().toString(36).substring(2, 9);

  onChange(event: any) {
    // O PrimeNG emite a propriedade 'checked'
    this.valueChange.emit(event.checked);
  }
}