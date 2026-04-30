import { Directive, Input } from '@angular/core';
import { BaseUIComponent } from '../base-ui.component';

@Directive()
export abstract class BaseField extends BaseUIComponent {
  // Todo campo do sistema tem isso
  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() errorMessage: string = '';
  @Input() helperText: string = '';
  @Input() disabled: boolean = false;
  @Input() controlStyleClass: string = '';
  @Input() controlCustomStyle: { [klass: string]: any } | null = null;
}