import { Component, Input, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-accordion-panel',
  standalone: true,
  template: `
    <!-- Captura todo o HTML interno (inputs, grids) projetado pelo desenvolvedor -->
    <ng-template #template>
      <ng-content></ng-content>
    </ng-template>
  `
})
export class AccordionPanelComponent {
  @Input({ required: true }) id!: string; // Identificador único da aba
  @Input({ required: true }) title!: string;
  @Input() statusIcon?: string;
  @Input() statusColor?: string;

  // Expõe o template capturado para o componente pai
  @ViewChild('template', { static: true }) contentTemplate!: TemplateRef<any>;
}