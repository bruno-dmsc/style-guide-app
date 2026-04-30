import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-field',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './field.component.html'
})
export class FieldComponent {
  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() errorMessage: string = '';
  @Input() helperText: string = '';
}