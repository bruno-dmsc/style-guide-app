import { Component, Input } from '@angular/core';
import { BaseField } from '../base-field.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-field',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './field.component.html'
})
export class FieldComponent extends BaseField {
  
}