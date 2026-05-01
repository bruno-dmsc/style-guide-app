import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule, DropdownChangeEvent } from 'primeng/dropdown';
import { BaseField } from '../base-field.component';

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
  
  // Novos Inputs para o Filtro
  @Input() filter: boolean = false;
  @Input() filterPlaceholder: string = 'Pesquisar...';
  
  @Output() valueChange = new EventEmitter<any>();

  onChange(event: DropdownChangeEvent) {
    this.valueChange.emit(event.value);
  }
}