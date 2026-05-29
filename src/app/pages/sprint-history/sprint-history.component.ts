import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CardComponent } from '../../shared/components/card/card.component';
import { FieldDropdownComponent } from '../../shared/components/field/field-dropdown/field-dropdown.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { SprintDashboardService, Demanda, Sprint } from '../dashboard/sprint-dashboard.service';

interface MetricasTipo {
  qtd: number;
  totalDias: number;
  noPrazo: number;
}

interface GrupoEstatistico {
  labelExibicao: string;
  tipos: { [key: string]: MetricasTipo };
  geral: MetricasTipo;
}

@Component({
  selector: 'app-sprint-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ChartModule,
    CardComponent,
    FieldDropdownComponent,
    ButtonComponent,
    RouterLink,
    RouterModule
  ],
  templateUrl: './sprint-history.component.html',
  styleUrls: ['./sprint-history.component.scss']
})
export class SprintHistoryComponent implements OnInit {

  // Controle de Estado dos Dados
  private rawDemandas: Demanda[] = [];
  private rawSprints: Sprint[] = [];

  // Configuração de Filtros
  viewType: 'month' | 'sprint' = 'month';
  viewTypeOptions = [
    { label: 'Agrupado por Mês', value: 'month' },
    { label: 'Agrupado por Sprint', value: 'sprint' }
  ];

  availablePeriods: { label: string, value: string }[] = [];
  startPeriod: string = '';
  endPeriod: string = '';

  // Datasets
  volumeData: any;
  leadTimeData: any;
  slaData: any;
  stackedOptions: any;
  basicOptions: any;

  private themeColors: any = {};
  slaOptions: any;

  private tiposValidos = ['Tarefa', 'Bug', 'Melhoria', 'Automação'];

  constructor(
    private dashboardService: SprintDashboardService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initChartOptions();
    this.loadDashboardData();
  }

  private initChartOptions(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color') || '#495057';
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary') || '#6c757d';
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border') || '#dfe7ef';

    this.themeColors = {
      tarefa: documentStyle.getPropertyValue('--azul-500') || '#42A5F5',
      bug: documentStyle.getPropertyValue('--laranja-500') || '#EF5350',
      melhoria: documentStyle.getPropertyValue('--verde-700') || '#66BB6A',
      automacao: documentStyle.getPropertyValue('--amarelo-700') || '#FFA726',
      geral: documentStyle.getPropertyValue('--purple-500') || '#7E57C2' // Usada como a "Média Geral"
    };

    this.stackedOptions = {
      maintainAspectRatio: false,
      plugins: {
        tooltips: { mode: 'index', intersect: false },
        legend: { labels: { color: textColor } }
      },
      scales: {
        x: { stacked: true, ticks: { color: textColorSecondary }, grid: { color: surfaceBorder, drawBorder: false } },
        y: { stacked: true, ticks: { color: textColorSecondary }, grid: { color: surfaceBorder, drawBorder: false } }
      }
    };

    this.slaOptions = {
      maintainAspectRatio: false,
      elements: {
        point: {
          radius: 5,
          hoverRadius: 8,
          borderWidth: 2
        },
        line: {
          tension: 0.3
        }
      },
      plugins: { legend: { labels: { color: textColor } } },
      scales: {
        x: { ticks: { color: textColorSecondary }, grid: { color: surfaceBorder, drawBorder: false } },
        y: {
          beginAtZero: true,
          suggestedMin: 0,
          suggestedMax: 100, // Força a escala a considerar o 100% como teto
          ticks: {
            color: textColorSecondary,
            callback: (value: number) => value + '%' // Adiciona o símbolo de % nos labels
          },
          grid: { color: surfaceBorder, drawBorder: false }
        }
      }
    };

    this.basicOptions = {
      maintainAspectRatio: false,
      elements: {
        point: {
          radius: 5,
          hoverRadius: 8,
          borderWidth: 2
        },
        line: {
          tension: 0.3
        }
      },
      plugins: {
        legend: { labels: { color: textColor } }
      },
      scales: {
        x: { ticks: { color: textColorSecondary }, grid: { color: surfaceBorder, drawBorder: false } },
        y: { ticks: { color: textColorSecondary }, grid: { color: surfaceBorder, drawBorder: false } }
      }
    };
  }

  private loadDashboardData(): void {
    this.dashboardService.getSprintData().subscribe(payload => {
      if (!payload || !payload.demandas) return;
      this.rawDemandas = payload.demandas.filter(d => d.resolvido);
      this.rawSprints = (payload.sprints || []).filter(s => s.state === 'closed');

      this.updatePeriodOptions();
      this.applyFilters();

      this.cdr.detectChanges();
    });
  }

  // Acionado ao alterar a visão (Mês <-> Sprint)
  onViewTypeChange(newType: string): void {
    this.viewType = newType as 'month' | 'sprint';
    this.updatePeriodOptions();
    this.applyFilters();
  }

  // Constrói os menus dropdown dinamicamente baseados na massa de dados
  private updatePeriodOptions(): void {
    const uniquePeriods = new Map<string, string>();

    this.rawDemandas.forEach(d => {
      const info = this.getGroupInfo(d);
      if (info) uniquePeriods.set(info.key, info.label);
    });

    const sortedKeys = Array.from(uniquePeriods.keys()).sort();

    this.availablePeriods = sortedKeys.map(key => {
      const cleanLabel = uniquePeriods.get(key)!; // Nome limpo (ex: "Sprint 10")
      let dropdownLabel = cleanLabel;

      // Se for agrupamento por Sprint, tenta anexar as datas apenas para o Dropdown
      if (this.viewType === 'sprint') {
        const sprint = this.rawSprints.find(s => s.name === cleanLabel);

        if (sprint && sprint.startDate && sprint.endDate) {
          const formatarData = (dateStr: string): string => {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return '';
            const dia = String(d.getDate()).padStart(2, '0');
            const mes = String(d.getMonth() + 1).padStart(2, '0');
            const ano = d.getFullYear();
            return `${dia}/${mes}/${ano}`;
          };

          const inicio = formatarData(sprint.startDate);
          const fim = formatarData(sprint.endDate);

          if (inicio && fim) {
            dropdownLabel = `${cleanLabel} (${inicio} - ${fim})`;
          }
        }
      }

      return {
        value: key,
        label: dropdownLabel
      };
    });

    if (this.availablePeriods.length > 0) {
      this.startPeriod = this.availablePeriods[0].value;
      this.endPeriod = this.availablePeriods[this.availablePeriods.length - 1].value;
    } else {
      this.startPeriod = '';
      this.endPeriod = '';
    }
  }

  // Rotina central que constrói os gráficos baseados nos filtros ativos
  applyFilters(): void {
    if (!this.availablePeriods.length || !this.startPeriod || !this.endPeriod) return;

    let startIdx = this.availablePeriods.findIndex(p => p.value === this.startPeriod);
    let endIdx = this.availablePeriods.findIndex(p => p.value === this.endPeriod);

    if (startIdx > endIdx) {
      [startIdx, endIdx] = [endIdx, startIdx];
    }

    const validPeriods = this.availablePeriods.slice(startIdx, endIdx + 1);
    const validKeys = validPeriods.map(p => p.value);

    const gruposMap = new Map<string, GrupoEstatistico>();

    // MODIFICAÇÃO AQUI: Garante o label limpo no mapa estatístico
    validPeriods.forEach(p => {
      const cleanLabel = this.viewType === 'sprint' ? p.label.split(' (')[0] : p.label;
      gruposMap.set(p.value, this.inicializarNovoGrupo(cleanLabel));
    });

    this.rawDemandas.forEach(d => {
      const info = this.getGroupInfo(d);
      if (!info || !validKeys.includes(info.key)) return;

      const grupo = gruposMap.get(info.key)!;
      const tipoTratado = this.normalizarTipoDemanda(d.tipo);

      if (grupo.tipos[tipoTratado]) {
        grupo.tipos[tipoTratado].qtd++;
        grupo.geral.qtd++;

        const dataCriado = new Date(d.criado);
        const dataResolvido = new Date(d.resolvido);

        if (!isNaN(dataCriado.getTime()) && !isNaN(dataResolvido.getTime())) {
          const dias = (dataResolvido.getTime() - dataCriado.getTime()) / (1000 * 60 * 60 * 24);
          const diasValidos = dias > 0 ? dias : 0;
          grupo.tipos[tipoTratado].totalDias += diasValidos;
          grupo.geral.totalDias += diasValidos;
        }

        if (d.no_prazo === 'Sim') {
          grupo.tipos[tipoTratado].noPrazo++;
          grupo.geral.noPrazo++;
        }
      }
    });

    // MODIFICAÇÃO AQUI: Limpa o eixo X removendo as datas (ex: "Sprint 10 (17/06...)" vira "Sprint 10")
    const labelsEixoX = validPeriods.map(p => this.viewType === 'sprint' ? p.label.split(' (')[0] : p.label);
    this.buildChartDatasets(validKeys, gruposMap, labelsEixoX);
  }

  // Prepara as séries para o ChartJS
  private buildChartDatasets(keys: string[], map: Map<string, GrupoEstatistico>, labelsX: string[]): void {
    const dVol: { [key: string]: number[] } = { Tarefa: [], Bug: [], Melhoria: [], Automação: [] };
    const dLead: { [key: string]: number[] } = { Tarefa: [], Bug: [], Melhoria: [], Automação: [], Geral: [] };
    const dSla: { [key: string]: number[] } = { Tarefa: [], Bug: [], Melhoria: [], Automação: [], Geral: [] };

    keys.forEach(key => {
      const g = map.get(key)!;

      this.tiposValidos.forEach(tipo => {
        const tInfo = g.tipos[tipo];
        dVol[tipo].push(tInfo.qtd);
        dLead[tipo].push(tInfo.qtd > 0 ? Number((tInfo.totalDias / tInfo.qtd).toFixed(1)) : 0);
        dSla[tipo].push(tInfo.qtd > 0 ? Math.round((tInfo.noPrazo / tInfo.qtd) * 100) : 0);
      });

      dLead['Geral'].push(g.geral.qtd > 0 ? Number((g.geral.totalDias / g.geral.qtd).toFixed(1)) : 0);
      dSla['Geral'].push(g.geral.qtd > 0 ? Math.round((g.geral.noPrazo / g.geral.qtd) * 100) : 0);
    });

    this.volumeData = {
      labels: labelsX,
      datasets: [
        { type: 'bar', label: 'Tarefas', backgroundColor: this.themeColors.tarefa, data: dVol['Tarefa'] },
        { type: 'bar', label: 'Bugs', backgroundColor: this.themeColors.bug, data: dVol['Bug'] },
        { type: 'bar', label: 'Melhorias', backgroundColor: this.themeColors.melhoria, data: dVol['Melhoria'] },
        { type: 'bar', label: 'Automações', backgroundColor: this.themeColors.automacao, data: dVol['Automação'] }
      ]
    };

    this.leadTimeData = {
      labels: labelsX,
      datasets: [
        { label: 'Tarefas', backgroundColor: this.themeColors.tarefa, data: dLead['Tarefa'] },
        { label: 'Bugs', backgroundColor: this.themeColors.bug, data: dLead['Bug'] },
        { label: 'Melhorias', backgroundColor: this.themeColors.melhoria, data: dLead['Melhoria'] },
        { label: 'Automações', backgroundColor: this.themeColors.automacao, data: dLead['Automação'] },
        { label: 'Média Geral', backgroundColor: this.themeColors.geral, data: dLead['Geral'] }
      ]
    };

    this.slaData = {
      labels: labelsX,
      datasets: [
        { label: 'Tarefas', backgroundColor: this.themeColors.tarefa, data: dSla['Tarefa'] },
        { label: 'Bugs', backgroundColor: this.themeColors.bug, data: dSla['Bug'] },
        { label: 'Automações', backgroundColor: this.themeColors.automacao, data: dSla['Automação'] },
        { label: 'SLA Geral', backgroundColor: this.themeColors.geral, data: dSla['Geral'] }
      ]
    };
  }

  // Gera a chave interna de agrupamento dependendo da visão escolhida
  private getGroupInfo(d: Demanda): { key: string, label: string } | null {
    if (this.viewType === 'month') {
      // ... (código existente da visão por mês mantido intacto)
      const date = new Date(d.resolvido);
      if (isNaN(date.getTime())) return null;
      const ano = date.getFullYear();
      const mesIdx = date.getMonth();
      const nomesMeses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      return {
        key: `${ano}-${String(mesIdx + 1).padStart(2, '0')}`,
        label: `${nomesMeses[mesIdx]}/${String(ano).substring(2)}`
      };
    } else {
      const sprint = this.rawSprints.find(s => s.id === d.sprint_id);
      if (!sprint) return null;

      let sortKey = '';

      // Verifica se a sprint possui uma data de início válida configurada
      if (sprint.startDate) {
        const dataInicio = new Date(sprint.startDate);

        // Monta a chave no formato YYYY-MM-DD para garantir a ordenação cronológica
        const ano = dataInicio.getFullYear();
        const mes = String(dataInicio.getMonth() + 1).padStart(2, '0');
        const dia = String(dataInicio.getDate()).padStart(2, '0');

        sortKey = `${ano}-${mes}-${dia}-${String(sprint.id).padStart(6, '0')}`;
      } else {
        // Fallback para sprints avulsas que possam estar sem data definida.
        // Adicionamos '9999-12-31' para que elas sempre apareçam no FINAL do gráfico,
        // seguidas pelo ID para evitar conflito de chaves idênticas.
        sortKey = `0000-01-01-${String(sprint.id).padStart(6, '0')}`;
      }

      return {
        key: sortKey,
        label: sprint.name
      };
    }
  }

  private inicializarNovoGrupo(labelDisplay: string): GrupoEstatistico {
    const baseObj = { qtd: 0, totalDias: 0, noPrazo: 0 };
    return {
      labelExibicao: labelDisplay,
      tipos: { Tarefa: { ...baseObj }, Bug: { ...baseObj }, Melhoria: { ...baseObj }, Automação: { ...baseObj } },
      geral: { ...baseObj }
    };
  }

  private normalizarTipoDemanda(t: string): string {
    if (!t) return 'Tarefa';
    const lower = t.trim().toLowerCase();
    if (lower === 'bug') return 'Bug';
    if (lower === 'melhoria') return 'Melhoria';
    if (lower === 'automação' || lower === 'automacao') return 'Automação';
    return 'Tarefa';
  }
}