import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonComponent } from '../button/button.component'; // Reutilizando nosso botão!
import { TableColumn, TableAction } from './table-column.interface';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonComponent],
  templateUrl: './table.component.html'
})
export class TableComponent {
  // Dados e Configuração
  @Input() items: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() dataKey: string = 'id';

  // Variações Visuais e de Comportamento
  @Input() selectable: boolean = false;
  @Input() showActions: boolean = false;
  @Input() compact: boolean = false; // Ativa o modo relatórios/alta densidade

  // Gerenciamento de Seleção (Two-way data binding)
  @Input() selectedItems: any[] = [];
  @Output() selectedItemsChange = new EventEmitter<any[]>();

  // Emissores de Eventos para as Ações
  @Output() onEdit = new EventEmitter<any>();
  @Output() onOptions = new EventEmitter<any>();

  // Novo Array de Ações
  @Input() actions: TableAction[] = [];

  // Novo Emissor Único de Ações
  @Output() onAction = new EventEmitter<{ actionId: string, item: any }>();

  // ==========================================
  // CONFIGURAÇÕES DE PAGINAÇÃO
  // ==========================================
  @Input() paginator: boolean = false; // Liga/Desliga a paginação inteira
  @Input() rows: number = 10;          // Quantidade de linhas por página
  @Input() totalRecords: number = 0;   // Essencial para o cálculo de páginas totais

  @Input() showCurrentPageReport: boolean = true;

  // Nova propriedade: Opções de quantidade por página
  @Input() rowsPerPageOptions: number[] = [10, 25, 50];

  // O "pulo do gato" do PrimeNG para o Server-side
  @Input() lazy: boolean = false;

  @Input() loading: boolean = false;
  @Input() loadingMessage: string = 'Carregando dados...';

  // Emissor que avisa a tela pai que o usuário trocou de página, filtrou ou ordenou
  @Output() onLoadData = new EventEmitter<any>();

}