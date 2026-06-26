import { Component, Input, ContentChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Accordion, AccordionPanel, AccordionHeader, AccordionContent } from 'primeng/accordion';
import { AccordionPanelComponent } from './accordion-panel.component';

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [CommonModule, Accordion, AccordionPanel, AccordionHeader, AccordionContent],
  templateUrl: './accordion.component.html'
})
export class AccordionComponent {
  @Input() multiple: boolean = false;
  
  // Define qual aba começa aberta (ex: ['embalagem', 'compatibilidade'])
  @Input() openTab: string | string[] = []; 

  // O "radar" que busca os nossos componentes filhos customizados
  @ContentChildren(AccordionPanelComponent) panels!: QueryList<AccordionPanelComponent>;
}