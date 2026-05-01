import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { BaseFieldComponent } from '../base-field.component';

@Component({
  selector: 'app-field-autocomplete',
  standalone: true,
  imports: [CommonModule, FormsModule, AutoCompleteModule],
  templateUrl: './field-autocomplete.component.html'
})

/**
 * TODO: [ARQUITETURA FUTURA] - Migração para API Integrada
 * 
 * Para garantir a escalabilidade do ERP, este componente deverá gerenciar 
 * suas próprias requisições HTTP, eliminando a necessidade de as telas 
 * passarem a lista de [suggestions] manualmente.
 * 
 * Próximos passos para o time de front-end:
 * 1. Adicionar: @Input() endpoint: string = '';
 * 2. Adicionar: @Input() searchParam: string = 'busca';
 * 3. Injetar o HttpClient no construtor.
 * 4. No método filterData(event), substituir a emissão do evento onSearch 
 *    por uma chamada real: this.http.get(`${endpoint}?${searchParam}=${event.query}`)
 * 5. Atualizar this.suggestions com a resposta da API.
 */

export class FieldAutocompleteComponent extends BaseFieldComponent {
  @Input() placeholder: string = 'Digite para buscar...';
  @Input() field: string = 'label'; 
  @Input() suggestions: any[] = []; 
  @Input() value: any = null; // Importante: deve armazenar o objeto completo
  @Input() hasError: boolean = false;

  @Output() valueChange = new EventEmitter<any>();
  @Output() onSearch = new EventEmitter<string>();
  @Output() onAdvancedSearch = new EventEmitter<string>();

  currentQuery: string = '';

  filterData(event: AutoCompleteCompleteEvent) {
    this.currentQuery = event.query;
    this.onSearch.emit(event.query);
  }

  onModelChange(event: any) {
    this.value = event;
    this.valueChange.emit(event);

    // Se o evento é uma string (usuário digitando), atualiza a query atual.
    // Se for objeto (selecionou algo), podemos limpar a query ou mantê-la.
    if (typeof event === 'string') {
      this.currentQuery = event;
    }
  }

  // Função que será disparada tanto pelo link de "Não encontrado" quanto pela lupa
  triggerAdvancedSearch() {
    // Pega o texto solto ou o texto do objeto selecionado
    const termoBusca = typeof this.value === 'string' ? this.value : this.currentQuery;
    this.onAdvancedSearch.emit(termoBusca || '');
  }
}