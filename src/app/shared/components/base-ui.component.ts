// base-ui.component.ts
import { Directive, Input } from '@angular/core';

// O decorator @Directive é obrigatório aqui para o Angular entender os @Inputs
@Directive() 
export abstract class BaseUIComponent {
  @Input() id: string = '';
  @Input() styleClass: string = '';
  @Input() customStyle: { [klass: string]: any } | null = null;
}