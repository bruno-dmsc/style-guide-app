import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseField } from '../base-field.component'; // Ajuste o caminho se necessário
import { DropdownModule, DropdownChangeEvent } from 'primeng/dropdown';

// Interface para garantir o padrão de dados do dropdown
export interface DropdownOption {
  label: string;
  value: any;
}

@Component({
  selector: 'app-field-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule],
  templateUrl: './field-dropdown.component.html'
})
export class FieldDropdownComponent extends BaseField {
  @Input() placeholder: string = 'Selecione uma opção';
  @Input() options: DropdownOption[] = [];
  @Input() value: any = null;

  @Input() hasError: boolean = false;
  
  @Output() valueChange = new EventEmitter<any>();

  onChange(event: DropdownChangeEvent) {
    // O PrimeNG já entrega o valor selecionado direto no event.value
    this.valueChange.emit(event.value);
  }
}