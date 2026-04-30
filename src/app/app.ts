import { Component, AfterViewInit, OnDestroy, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BadgeModule } from 'primeng/badge';

import { CardComponent } from './shared/components/card/card.component';
import { FieldTextComponent } from './shared/components/field/field-text/field-text.component';
import { ButtonComponent } from './shared/components/button/button.component';
import { TableComponent } from './shared/components/table/table.component';
import { TableColumn, TableAction } from './shared/components/table/table-column.interface';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    TableModule,
    FileUploadModule,
    ProgressSpinnerModule,
    BadgeModule,
    CardComponent,
    FieldTextComponent,
    ButtonComponent,
    TableComponent
  ],
  templateUrl: './app.html'
})
export class AppComponent implements AfterViewInit, OnDestroy {
  secaoAtiva: string = 'tokens-cores';

  private observer: IntersectionObserver | null = null;
  private secoesVisiveis = new Set<string>();
  private ordemDasSecoes: string[] = [];

  constructor(
    private el: ElementRef,
    private cdr: ChangeDetectorRef
  ) { }

  ngAfterViewInit(): void {
    const secoes = this.el.nativeElement.querySelectorAll('section[id]');
    this.ordemDasSecoes = Array.from(secoes).map((secao: any) => secao.id);

    const opcoes = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    this.observer = new IntersectionObserver((entradas) => {
      entradas.forEach(entrada => {
        if (entrada.isIntersecting) {
          this.secoesVisiveis.add(entrada.target.id);
        } else {
          this.secoesVisiveis.delete(entrada.target.id);
        }
      });

      const primeiraSecaoNaTela = this.ordemDasSecoes.find(id => this.secoesVisiveis.has(id));

      if (primeiraSecaoNaTela && this.secaoAtiva !== primeiraSecaoNaTela) {
        this.secaoAtiva = primeiraSecaoNaTela;
        this.cdr.detectChanges();
      }

    }, opcoes);

    secoes.forEach((secao: Element) => {
      this.observer?.observe(secao);
    });
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  linhasSelecionadas: any[] = [];
  linhasSelecionadasScroll: any[] = [];

  // ==========================================
  // DADOS: TABELA PADRÃO
  // ==========================================
  colunasPadrao: TableColumn[] = [
    { field: 'codigo', header: 'CÓDIGO' },
    { field: 'nome', header: 'NOME' },
    { field: 'marca', header: 'MARCA/MODELO' },
    { field: 'valor', header: 'VALOR DE VENDA', align: 'right' },
    { field: 'qtd', header: 'QUANTIDADE', align: 'right' }
  ];

  dadosPadrao = [
    { codigo: '7095', nome: 'Volante direção Fiat Mobi 2017', marca: 'Fiat Mobi', valor: 'R$ 300,00', qtd: 1 },
    { codigo: '7096', nome: 'Volante direção Fiat Mobi 2017', marca: 'Fiat Mobi', valor: 'R$ 300,00', qtd: 1 },
    { codigo: '7097', nome: 'Volante direção Fiat Mobi 2017', marca: 'Fiat Mobi', valor: 'R$ 300,00', qtd: 1 }
  ];

  // ==========================================
  // DADOS: TABELA SCROLL LATERAL
  // ==========================================
  colunasScroll: TableColumn[] = [
    { field: 'id', header: 'CÓDIGO', minWidth: '100px' },
    { field: 'peca', header: 'PEÇA', minWidth: '250px' },
    { field: 'veiculo', header: 'VEÍCULO ORIGEM', minWidth: '200px' },
    { field: 'placa', header: 'PLACA', minWidth: '120px' },
    { field: 'chassi', header: 'CHASSI', minWidth: '150px' },
    { field: 'km', header: 'QUILOMETRAGEM', align: 'right', minWidth: '120px' },
    { field: 'fornecedor', header: 'FORNECEDOR', minWidth: '200px' },
    { field: 'data', header: 'DATA ENTRADA', align: 'center', minWidth: '120px' },
    { field: 'prateleira', header: 'LOCALIZAÇÃO', align: 'center', minWidth: '120px' },
    { field: 'valor', header: 'VALOR', align: 'right', minWidth: '150px' }
  ];

  dadosScroll = [
    { id: '1042', peca: 'Motor Parcial 1.0 Fire Flex', veiculo: 'Fiat Uno 2012', placa: 'ABC-1234', chassi: '9BD...', km: '120.000', fornecedor: 'Leilão Receita', data: '12/04/2026', prateleira: 'A-12', valor: 'R$ 2.500,00' },
    { id: '1043', peca: 'Caixa de Câmbio Manual', veiculo: 'VW Gol G6 2015', placa: 'XYZ-9876', chassi: '9BW...', km: '85.000', fornecedor: 'Seguradora X', data: '14/04/2026', prateleira: 'B-04', valor: 'R$ 1.800,00' },
    { id: '1044', peca: 'Radiador de Água Original', veiculo: 'Chevrolet Onix 2018', placa: 'DEF-5678', chassi: '9BG...', km: '60.000', fornecedor: 'Leilão Detran', data: '20/04/2026', prateleira: 'C-01', valor: 'R$ 450,00' }
  ];

  // ==========================================
  // DADOS: TABELA RELATÓRIO (COMPACTA)
  // ==========================================
  colunasRelatorio: TableColumn[] = [
    { field: 'data', header: 'DATA', align: 'center' },
    { field: 'nf', header: 'NOTA FISCAL' },
    { field: 'fornecedor', header: 'FORNECEDOR' },
    { field: 'valor', header: 'VALOR TOTAL', align: 'right' },
    { field: 'status', header: 'STATUS', align: 'center' }
  ];

  /*dadosRelatorio = [
    { data: '02/03/2026', nf: '001.234', fornecedor: 'Auto Peças Silva', valor: 'R$ 1.500,00', status: 'Processado' },
    { data: '03/03/2026', nf: '001.235', fornecedor: 'Sucata e Cia', valor: 'R$ 3.200,00', status: 'Pendente' },
    { data: '04/03/2026', nf: '001.236', fornecedor: 'Leilão Detran', valor: 'R$ 8.900,00', status: 'Processado' },
    { data: '05/03/2026', nf: '001.237', fornecedor: 'Seguradora X', valor: 'R$ 4.100,00', status: 'Processado' }
  ];*/

  // Métodos de ação (Apenas para evitar erros no console do exemplo)
  editarItem(item: any) { console.log('Editar', item); }
  opcoesItem(item: any) { console.log('Opções', item); }

  acoesPadrao: TableAction[] = [
    { id: 'editar', icon: 'pi-pencil', color: 'help' },
    { id: 'opcoes', icon: 'pi-ellipsis-v', color: 'help' }
  ];

  // Ações para a Tabela de Scroll (Lixeira)
  acoesScroll: TableAction[] = [
    { id: 'excluir', icon: 'pi-trash', color: 'danger' }
  ];

  // Função centralizada para lidar com os cliques da tabela
  executarAcaoTabela(evento: { actionId: string, item: any }) {
    if (evento.actionId === 'editar') {
      console.log('Abrir modal de edição para:', evento.item.nome || evento.item.peca);
    }
    else if (evento.actionId === 'excluir') {
      console.log('Deletar registro:', evento.item.codigo || evento.item.id);
    }
    else if (evento.actionId === 'opcoes') {
      console.log('Abrir menu de opções extras para:', evento.item);
    }
  }


  // ==========================================
  // DADOS: TABELA RELATÓRIO (COMPACTA COM PAGINAÇÃO LAZY)
  // ==========================================

  // 1. Simulando o Banco de Dados da API
  private bancoDeDadosRelatorio = [
    { data: '02/03/2026', nf: '001.234', fornecedor: 'Auto Peças Silva', valor: 'R$ 1.500,00', status: 'Processado' },
    { data: '03/03/2026', nf: '001.235', fornecedor: 'Sucata e Cia', valor: 'R$ 3.200,00', status: 'Pendente' },
    { data: '04/03/2026', nf: '001.236', fornecedor: 'Leilão Detran', valor: 'R$ 8.900,00', status: 'Processado' },
    { data: '05/03/2026', nf: '001.237', fornecedor: 'Seguradora X', valor: 'R$ 4.100,00', status: 'Processado' },
    { data: '06/03/2026', nf: '001.238', fornecedor: 'Auto Peças Silva', valor: 'R$ 1.200,00', status: 'Pendente' },
    { data: '07/03/2026', nf: '001.239', fornecedor: 'Desmonte Z', valor: 'R$ 5.400,00', status: 'Processado' },
    { data: '08/03/2026', nf: '001.240', fornecedor: 'Oficina do João', valor: 'R$ 800,00', status: 'Pendente' }
  ];

  // Variáveis da Tabela
  dadosRelatorio: any[] = [];
  totalRegistrosRelatorio: number = this.bancoDeDadosRelatorio.length;
  
  // Nova variável de estado
  carregandoRelatorio: boolean = false;

  // Adicione esta variável junto com as outras da tabela
  private timeoutRef: any;

  carregarPaginaRelatorio(eventoLazy: any) {
    // 1. Debounce: Previne chamadas duplas do PrimeNG cancelando a anterior
    if (this.timeoutRef) {
      clearTimeout(this.timeoutRef);
    }

    // 2. Microtask: Forma correta e à prova de falhas para evitar o NG0100
    Promise.resolve().then(() => {
      this.carregandoRelatorio = true;
      this.cdr.detectChanges(); // Força o Angular a desenhar o véu de loading na hora[cite: 11]
    });

    // 3. A Requisição Simulada
    this.timeoutRef = setTimeout(() => {
      const inicio = eventoLazy.first ?? 0;
      const quantidade = 3; 

      this.dadosRelatorio = this.bancoDeDadosRelatorio.slice(inicio, inicio + quantidade);

      // 4. Desliga o loading e avisa o Angular novamente
      this.carregandoRelatorio = false;
      this.cdr.detectChanges();
      
    }, 500); 
  }

  // Variável que controla a cor do drag-and-drop
  isDragging: boolean = false;

  // Dispara quando o arquivo está sobrevoando a área
  onDragOver(event: DragEvent) {
    event.preventDefault(); // Necessário para o navegador permitir o drop
    this.isDragging = true;
  }

  // Dispara quando o arquivo sai da área sem ser solto
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  // Dispara quando o arquivo é solto
  onDrop(event: DragEvent) {
    // Não usamos preventDefault() aqui para não quebrar o upload nativo do PrimeNG
    this.isDragging = false;
  }


  // Configurações de limite para o componente
  limiteArquivos: number = 4;
  estaCarregando: boolean = false;


  /**
   * Disparado no exato momento em que o usuário confirma a seleção dos arquivos
   */
  simularCarregamento(event: any, uploader: any) {
    // 1. Interceptação Inteligente
    // Verifica se a quantidade total de arquivos na fila ultrapassou o limite
    if (uploader.files.length > this.limiteArquivos) {

      // O splice "corta" o array a partir do índice limite.
      // Ex: se o limite é 4 e vieram 6, ele mantém de 0 a 3, e exclui o resto.
      uploader.files.splice(this.limiteArquivos);

      console.warn(`Você tentou enviar mais imagens do que o permitido. Apenas as ${this.limiteArquivos} primeiras foram mantidas.`);
    }

    // 2. Fluxo normal de simulação
    this.estaCarregando = true;

    setTimeout(() => {
      this.estaCarregando = false;
    }, 1500);
  }



}