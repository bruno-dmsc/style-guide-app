import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { ChartModule } from 'primeng/chart';
import { CardComponent } from '../../shared/components/card/card.component';
import { FieldDropdownComponent } from '../../shared/components/field/field-dropdown/field-dropdown.component';
import { SprintDashboardService, Demanda, Sprint } from '../dashboard/sprint-dashboard.service';

interface DeveloperStatus {
  nome: string;
  ativo: boolean;
}

interface MetricasAgrupadas {
  titulo: string;
  dados: {
    volume: number;
    cycleTime: string;
    sla: number;
    reopenRate: number;
  };
}

@Component({
  selector: 'app-dev-metrics',
  standalone: true,
  imports: [
    CommonModule, 
    CardComponent, 
    FieldDropdownComponent,
    ChartModule // Importação necessária para os gráficos
  ],
  templateUrl: './dev-metrics.component.html'
})
export class DevMetricsComponent implements OnInit {
  private dashboardService = inject(SprintDashboardService);
  private http = inject(HttpClient);

  // Seletores e Dados Globais
  developers: { label: string, value: string }[] = [];
  selectedDeveloper: string = '';
  allIssues: Demanda[] = [];
  allSprints: Sprint[] = [];
  
  // Dados do Dev Selecionado
  currentDevIssues: Demanda[] = [];
  visoesMetricas: MetricasAgrupadas[] = [];

  // Configurações e Dados dos Gráficos Históricos
  viewTypeOptions = [
    { label: 'Por Sprint', value: 'sprint' },
    { label: 'Por Mês', value: 'month' }
  ];
  viewType: string = 'sprint';
  availablePeriods: { label: string, value: string }[] = [];
  startPeriod: string = '';
  endPeriod: string = '';

  volumeData: any;
  leadTimeData: any;
  slaData: any;
  basicOptions: any;
  stackedOptions: any;

  ngOnInit(): void {
    this.initChartOptions();
    this.carregarDados();
  }

  carregarDados(): void {
    forkJoin({
      sprintData: this.dashboardService.getSprintData(),
      devStatus: this.http.get<DeveloperStatus[]>('/assets/developers.json')
    }).subscribe({
      next: ({ sprintData, devStatus }) => {
        if (sprintData && sprintData.demandas) {
          this.allIssues = sprintData.demandas;
          this.allSprints = sprintData.sprints || [];
          this.populateDevelopersDropdown(devStatus);
        }
      },
      error: (err) => console.error('Erro ao carregar arquivos:', err)
    });
  }

  private populateDevelopersDropdown(devStatus: DeveloperStatus[]): void {
    const statusMap = new Map<string, boolean>();
    devStatus.forEach(d => statusMap.set(d.nome.trim().toLowerCase(), d.ativo));

    const uniqueDevs = new Set<string>();
    
    this.allIssues.forEach(issue => {
      if (issue.responsavel) {
        const nomeDev = issue.responsavel.trim();
        const nomeLower = nomeDev.toLowerCase();
        const estaAtivo = statusMap.has(nomeLower) ? statusMap.get(nomeLower) : true;
        
        if (estaAtivo) uniqueDevs.add(nomeDev);
      }
    });

    this.developers = Array.from(uniqueDevs)
      .sort()
      .map(dev => ({ label: dev, value: dev }));
  }

  onDeveloperChange(): void {
    if (!this.selectedDeveloper) return;
    
    // Separa apenas as demandas do dev selecionado
    this.currentDevIssues = this.allIssues.filter(
      issue => issue.responsavel && issue.responsavel.trim() === this.selectedDeveloper
    );

    this.processarVisoesGerais();
    this.popularPeriodos(); // Baseado nas demandas do dev
    this.processarGraficos();
  }

  // --- LÓGICA DE ÍNDICES GERAIS (A que já tínhamos feito) ---
  processarVisoesGerais(): void {
    this.visoesMetricas = [
      { titulo: 'Geral', dados: this.calcularIndicadores(this.currentDevIssues) },
      { titulo: 'Tarefas', dados: this.calcularIndicadores(this.currentDevIssues.filter(d => d.tipo === 'Tarefa')) },
      { titulo: 'Bugs', dados: this.calcularIndicadores(this.currentDevIssues.filter(d => d.tipo === 'Bug')) },
      { titulo: 'Melhorias', dados: this.calcularIndicadores(this.currentDevIssues.filter(d => d.tipo === 'Melhoria')) },
      { titulo: 'Automações', dados: this.calcularIndicadores(this.currentDevIssues.filter(d => d.tipo === 'Automação')) }
    ];
  }

  private calcularIndicadores(issues: Demanda[]) {
    const volume = issues.length;
    let totalDays = 0, countWithDates = 0, totalRetornos = 0;

    const comSla = issues.filter(d => d.no_prazo === 'Sim' || d.no_prazo === 'Não');
    const noPrazo = comSla.filter(d => d.no_prazo === 'Sim').length;
    const sla = comSla.length > 0 ? Math.round((noPrazo / comSla.length) * 100) : (volume > 0 ? 100 : 0);

    issues.forEach(issue => {
      if (issue.criado && issue.resolvido) {
        const diffTime = Math.abs(new Date(issue.resolvido).getTime() - new Date(issue.criado).getTime());
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        if (!isNaN(diffDays)) {
          totalDays += diffDays;
          countWithDates++;
        }
      }
      if (issue.retornos_teste) totalRetornos += Number(issue.retornos_teste);
    });

    const avgCycleTime = countWithDates > 0 ? (totalDays / countWithDates).toFixed(1) : '0.0';
    return { volume, cycleTime: avgCycleTime, sla, reopenRate: totalRetornos };
  }

  // --- LÓGICA DE GRÁFICOS EVOLUTIVOS (Importada do Sprint History) ---
  
  onViewTypeChange(newType: string): void {
    this.viewType = newType;
    this.popularPeriodos();
    this.processarGraficos();
  }

  private popularPeriodos(): void {
    const periodosMap = new Map<string, { label: string, key: string }>();

    this.currentDevIssues.forEach(demanda => {
      const { key, label } = this.getSortKeyAndLabel(demanda);
      if (!periodosMap.has(key)) {
        periodosMap.set(key, { label, key });
      }
    });

    const periodosOrdenados = Array.from(periodosMap.values())
      .sort((a, b) => a.key.localeCompare(b.key));

    this.availablePeriods = periodosOrdenados.map(p => ({ label: p.label, value: p.key }));

    if (this.availablePeriods.length > 0) {
      this.startPeriod = this.availablePeriods[0].value;
      this.endPeriod = this.availablePeriods[this.availablePeriods.length - 1].value;
    }
  }

  processarGraficos(): void {
    if (!this.startPeriod || !this.endPeriod || this.currentDevIssues.length === 0) return;

    const gruposMap = new Map<string, any>();

    // 1. Agrupar e filtrar demandas do dev
    this.currentDevIssues.forEach(demanda => {
      const { key, label } = this.getSortKeyAndLabel(demanda);
      
      // Filtro de período
      if (key >= this.startPeriod && key <= this.endPeriod) {
        if (!gruposMap.has(key)) {
          gruposMap.set(key, {
            labelExibicao: label,
            key: key,
            tipos: {
              Tarefa: { qtd: 0, totalDias: 0, noPrazo: 0 },
              Bug: { qtd: 0, totalDias: 0, noPrazo: 0 },
              Melhoria: { qtd: 0, totalDias: 0, noPrazo: 0 },
              Automação: { qtd: 0, totalDias: 0, noPrazo: 0 }
            },
            geral: { qtd: 0, totalDias: 0, noPrazo: 0, totalComSla: 0 }
          });
        }

        const grupo = gruposMap.get(key);
        const tipoNormalizado = ['Tarefa', 'Bug', 'Melhoria', 'Automação'].includes(demanda.tipo) ? demanda.tipo : 'Tarefa';
        
        let dias = 0;
        if (demanda.criado && demanda.resolvido) {
          dias = Math.abs(new Date(demanda.resolvido).getTime() - new Date(demanda.criado).getTime()) / (1000 * 60 * 60 * 24);
        }

        // Soma Geral
        grupo.geral.qtd++;
        grupo.geral.totalDias += (dias || 0);
        if (demanda.no_prazo === 'Sim' || demanda.no_prazo === 'Não') {
          grupo.geral.totalComSla++;
          if (demanda.no_prazo === 'Sim') grupo.geral.noPrazo++;
        }

        // Soma por Tipo
        grupo.tipos[tipoNormalizado].qtd++;
        grupo.tipos[tipoNormalizado].totalDias += (dias || 0);
      }
    });

    // 2. Ordenar Grupos
    const gruposOrdenados = Array.from(gruposMap.values()).sort((a, b) => a.key.localeCompare(b.key));
    const labels = gruposOrdenados.map(g => g.labelExibicao);

    // 3. Montar Volume (Barra Empilhada)
    this.volumeData = {
      labels: labels,
      datasets: [
        { label: 'Melhorias', backgroundColor: '#10b981', data: gruposOrdenados.map(g => g.tipos['Melhoria'].qtd) },
        { label: 'Automações', backgroundColor: '#8b5cf6', data: gruposOrdenados.map(g => g.tipos['Automação'].qtd) },
        { label: 'Tarefas', backgroundColor: '#3b82f6', data: gruposOrdenados.map(g => g.tipos['Tarefa'].qtd) },
        { label: 'Bugs', backgroundColor: '#ef4444', data: gruposOrdenados.map(g => g.tipos['Bug'].qtd) }
      ]
    };

    // 4. Montar Cycle Time (Linha)
    this.leadTimeData = {
      labels: labels,
      datasets: [
        {
          label: 'Média Geral (Dias)',
          borderColor: '#6366f1',
          data: gruposOrdenados.map(g => g.geral.qtd > 0 ? (g.geral.totalDias / g.geral.qtd).toFixed(1) : 0),
          fill: false,
          tension: 0.4
        }
      ]
    };

    // 5. Montar SLA (Linha)
    this.slaData = {
      labels: labels,
      datasets: [
        {
          label: 'SLA Cumprido (%)',
          borderColor: '#10b981',
          data: gruposOrdenados.map(g => g.geral.totalComSla > 0 ? Math.round((g.geral.noPrazo / g.geral.totalComSla) * 100) : 100),
          fill: false,
          tension: 0.4
        }
      ]
    };
  }

  private getSortKeyAndLabel(demanda: Demanda): { key: string, label: string } {
    if (this.viewType === 'month') {
      const data = demanda.resolvido ? new Date(demanda.resolvido) : (demanda.criado ? new Date(demanda.criado) : new Date());
      const ano = data.getFullYear();
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      const labelMes = data.toLocaleString('pt-BR', { month: 'short', year: 'numeric' });
      return { key: `${ano}-${mes}`, label: labelMes.charAt(0).toUpperCase() + labelMes.slice(1) };
    } else {
      const sprint = this.allSprints.find(s => s.id === demanda.sprint_id);
      if (sprint) {
        const dataInicio = sprint.startDate ? new Date(sprint.startDate) : new Date();
        const ano = dataInicio.getFullYear();
        const mes = String(dataInicio.getMonth() + 1).padStart(2, '0');
        const dia = String(dataInicio.getDate()).padStart(2, '0');
        return { key: `${ano}-${mes}-${dia}-${String(sprint.id).padStart(6, '0')}`, label: sprint.name };
      }
      return { key: `0000-00-00-${demanda.sprint_id}`, label: `Sprint ID ${demanda.sprint_id}` };
    }
  }

  private initChartOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color') || '#495057';
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary') || '#6c757d';
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border') || '#dfe7ef';

    this.basicOptions = {
      plugins: { legend: { labels: { color: textColor } } },
      scales: {
        x: { ticks: { color: textColorSecondary }, grid: { color: surfaceBorder, drawBorder: false } },
        y: { ticks: { color: textColorSecondary }, grid: { color: surfaceBorder, drawBorder: false } }
      }
    };

    this.stackedOptions = {
      plugins: { legend: { labels: { color: textColor } }, tooltip: { mode: 'index', intersect: false } },
      scales: {
        x: { stacked: true, ticks: { color: textColorSecondary }, grid: { color: surfaceBorder, drawBorder: false } },
        y: { stacked: true, ticks: { color: textColorSecondary }, grid: { color: surfaceBorder, drawBorder: false } }
      }
    };
  }
}