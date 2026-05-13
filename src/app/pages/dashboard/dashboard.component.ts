import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { MeterGroupModule } from 'primeng/metergroup';


import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { FieldDropdownComponent, DropdownOption } from '../../shared/components/field/field-dropdown/field-dropdown.component';
import { TableComponent } from '../../shared/components/table/table.component';
import { TableColumn } from '../../shared/components/table/table-column.interface';
import { KnobComponent } from '../../shared/components/knob/knob.component';

import { SprintDashboardService, Demanda, SprintDataPayload } from './sprint-dashboard.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterLink,
        TagModule,
        MeterGroupModule,
        CardComponent,
        ButtonComponent,
        FieldDropdownComponent,
        TableComponent,
        KnobComponent
    ],
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
    private dashboardService = inject(SprintDashboardService);
    private cdr = inject(ChangeDetectorRef);

    sprints: DropdownOption[] = [];
    todasDemandas: Demanda[] = [];
    sprintSelecionada: any = null;
    demandasDaSprint: any[] = [];

    // Colunas da listagem principal
    colunasTabela: TableColumn[] = [
        { field: 'chave', header: 'NÚMERO', minWidth: '110px' },
        { field: 'resumo', header: 'RESUMO/TÍTULO', minWidth: '250px' },
        { field: 'rn_texto', header: 'RELEASE NOTES', minWidth: '250px' },
        { field: 'tipo', header: 'TIPO', minWidth: '100px' },
        { field: 'dias_resolver', header: 'DIAS P/ RESOLVER', align: 'center', minWidth: '140px' },
        {
            field: 'no_prazo',
            header: 'NO PRAZO',
            align: 'center',
            minWidth: '100px',
            type: 'tag',
            tagSeverity: (valor: any) => {
                if (valor === 'Sim') return 'success';
                if (valor === 'Não') return 'danger';
                return 'info';
            }},
        { field: 'resolucao', header: 'Conclusão', minWidth: '130px' },
        { field: 'responsavel', header: 'Responsável', minWidth: '150px' },
        { field: 'projeto', header: 'Projeto?', minWidth: '100px' }
    ];

    // Colunas para Performance e Clientes
    colunasPerformance: TableColumn[] = [
        { field: 'responsavel', header: 'COLABORADOR', minWidth: '200px' },
        { field: 'melhorias', header: 'MELHORIAS', align: 'center' },
        { field: 'bugs', header: 'CORREÇÕES', align: 'center' },
        { field: 'tarefas', header: 'TAREFAS', align: 'center' },
        { field: 'total', header: 'TOTAL', align: 'center' }
    ];

    colunasClientes: TableColumn[] = [
        { field: 'nome', header: 'CLIENTE', minWidth: '350px' },
        { field: 'total', header: 'DEMANDAS', align: 'center', minWidth: '100px' }
    ];

    // Variáveis Totais
    totalEntregas = 0;
    totalCorrecoes = 0;
    totalMelhorias = 0;
    totalTarefas = 0;
    textoReleaseNotes = '';

    // Métricas Globais
    percSlaGeral: number = 0;
    percQualidade: number = 0;
    percSlaBugs: number = 0;
    leadTimeGeral: number | string = '-';
    meterGroupData: any[] = [];

    getKnobColor(value: number | string): string {
        let num = typeof value === 'string' ? parseFloat(value.replace('%', '')) : value;
        if (isNaN(num)) return 'var(--fundo-500)';
        if (num < 25) return 'var(--vermelho-500)';
        if (num <= 50) return 'var(--laranja-500)';
        if (num <= 75) return 'var(--amarelo-600)';
        return 'var(--verde-700)';
    }

    // Métricas Específicas e Listas Auxiliares
    metricasMelhorias = { total: 0, leadTime: '-' as string | number, sla: '-' as string | number };
    metricasCorrecoes = { total: 0, leadTime: '-' as string | number, sla: '-' as string | number };
    metricasTarefas = { total: 0, leadTime: '-' as string | number, sla: '-' as string | number };

    performanceColaboradores: any[] = [];
    clientesSprint: any[] = [];

    ngOnInit(): void {
        this.carregarDados();
    }

    carregarDados(): void {
        this.dashboardService.getSprintData().subscribe({
            next: (dados: SprintDataPayload) => {
                this.sprints = dados.sprints
                    .sort((a, b) => b.id - a.id)
                    .map(s => ({ label: s.name, value: s.id }));

                this.todasDemandas = dados.demandas;

                const sprintAtiva = dados.sprints.find(s => s.state === 'active');
                if (sprintAtiva) {
                    this.sprintSelecionada = sprintAtiva.id;
                } else if (this.sprints.length > 0) {
                    this.sprintSelecionada = this.sprints[0].value;
                }

                if (this.sprintSelecionada) {
                    this.onSprintChange();
                }

                this.cdr.detectChanges();
            },
            error: (err) => console.error('Erro ao carregar dados', err)
        });
    }

    onSprintChange(): void {
        if (!this.sprintSelecionada) return;

        // 1. Mapeamento base das demandas
        this.demandasDaSprint = this.todasDemandas
            .filter(d => d.sprint_id === this.sprintSelecionada)
            .map(d => {
                const dataCriacao = new Date(d.criado);
                const dataResolvido = d.resolvido ? new Date(d.resolvido) : null;

                let dias = 0;
                if (dataResolvido) {
                    const diffTime = Math.abs(dataResolvido.getTime() - dataCriacao.getTime());
                    dias = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                }

                return {
                    ...d,
                    dias_resolver: d.resolvido ? dias : '-',
                    no_prazo: d.no_prazo ? d.no_prazo : '-',
                    projeto: d.tipo.toLowerCase() === 'tarefa' ? 'Não' : 'Sim',
                };
            });

        // 2. Divisão por tipos
        this.totalEntregas = this.demandasDaSprint.length;
        const bugs = this.demandasDaSprint.filter(d => ['correção', 'bug', 'correcao'].includes(d.tipo.toLowerCase()));
        const melhorias = this.demandasDaSprint.filter(d => d.tipo.toLowerCase() === 'melhoria');
        const tarefas = this.demandasDaSprint.filter(d => d.tipo.toLowerCase() === 'tarefa');

        this.totalCorrecoes = bugs.length;
        this.totalMelhorias = melhorias.length;
        this.totalTarefas = tarefas.length;

        // 3. Cálculos de SLA e Lead Time Específicos
        this.metricasCorrecoes = this.calcularMetricas(bugs);
        this.metricasMelhorias = this.calcularMetricas(melhorias);
        this.metricasTarefas = this.calcularMetricas(tarefas);

        // Preenche o MeterGroup
        this.meterGroupData = [
            { label: 'Melhorias', value: this.totalMelhorias, color: 'var(--verde-700)' },
            { label: 'Correções', value: this.totalCorrecoes, color: 'var(--laranja-500)' },
            { label: 'Tarefas', value: this.totalTarefas, color: 'var(--azul-500)' }
        ];

        // 4. Cálculos Globais
        // Lead Time Geral
        const resolvidasGlobais = this.demandasDaSprint.filter(d => typeof d.dias_resolver === 'number');
        if (resolvidasGlobais.length > 0) {
            const soma = resolvidasGlobais.reduce((acc, d) => acc + (d.dias_resolver as number), 0);
            this.leadTimeGeral = Math.round((soma / resolvidasGlobais.length) * 10) / 10;
        } else {
            this.leadTimeGeral = '-';
        }

        // % No Prazo (SLA Geral)
        const demandasComSla = this.demandasDaSprint.filter(d => d.no_prazo !== '-');
        if (demandasComSla.length > 0) {
            const noPrazoCount = demandasComSla.filter(d => d.no_prazo === 'Sim').length;
            this.percSlaGeral = Math.round((noPrazoCount / demandasComSla.length) * 100);
        } else {
            this.percSlaGeral = 0;
        }

        // % Sem Retrabalho (Qualidade)
        if (this.totalEntregas > 0) {
            const semRetrabalhoCount = this.demandasDaSprint.filter(d => d.retornos_teste === 0).length;
            this.percQualidade = Math.round((semRetrabalhoCount / this.totalEntregas) * 100);
        } else {
            this.percQualidade = 0;
        }

        // % SLA de Bugs Histórico
        const bugsComSla = bugs.filter(b => b.no_prazo !== '-');
        if (bugsComSla.length > 0) {
            const bugsNoPrazo = bugsComSla.filter(b => b.no_prazo === 'Sim').length;
            this.percSlaBugs = Math.round((bugsNoPrazo / bugsComSla.length) * 100);
        } else {
            this.percSlaBugs = 0;
        }

        // 5. Matriz de Performance
        const colabsMap: any = {};
        this.demandasDaSprint.forEach(d => {
            const resp = d.responsavel || 'Não Atribuído';
            if (!colabsMap[resp]) {
                colabsMap[resp] = { responsavel: resp, bugs: 0, melhorias: 0, tarefas: 0, total: 0 };
            }
            colabsMap[resp].total++;
            const t = d.tipo.toLowerCase();
            if (['correção', 'bug', 'correcao'].includes(t)) colabsMap[resp].bugs++;
            else if (t === 'melhoria') colabsMap[resp].melhorias++;
            else if (t === 'tarefa') colabsMap[resp].tarefas++;
        });
        this.performanceColaboradores = Object.values(colabsMap).sort((a: any, b: any) => b.total - a.total);

        // 6. Ranking de Clientes (Agrupa e exibe todos, ordenados)
        const clientesMap: any = {};
        this.demandasDaSprint.forEach(d => {
            if (d.cliente && d.cliente.trim() !== '') {
                // Preservado o nome original completo (com CNPJ) conforme sua requisição
                clientesMap[d.cliente] = (clientesMap[d.cliente] || 0) + 1;
            }
        });
        this.clientesSprint = Object.keys(clientesMap)
            .map(k => ({ nome: k, total: clientesMap[k] }))
            .sort((a, b) => b.total - a.total);

        this.gerarTextoRN();
    }

    // Função auxiliar para os cards por tipo
    calcularMetricas(demandas: any[]) {
        const total = demandas.length;

        const resolvidas = demandas.filter(d => typeof d.dias_resolver === 'number');
        let leadTime: string | number = '-';
        if (resolvidas.length > 0) {
            const soma = resolvidas.reduce((acc, d) => acc + d.dias_resolver, 0);
            leadTime = Math.round((soma / resolvidas.length) * 10) / 10;
        }

        const comSla = demandas.filter(d => d.no_prazo === 'Sim' || d.no_prazo === 'Não');
        let sla: string | number = '-';
        if (comSla.length > 0) {
            const noPrazo = comSla.filter(d => d.no_prazo === 'Sim').length;
            sla = Math.round((noPrazo / comSla.length) * 100);
        }

        return { total, leadTime, sla };
    }

    gerarTextoRN(): void {
        const itensValidos = this.demandasDaSprint.filter(d =>
            d.rn_texto && d.rn_texto.toUpperCase() !== 'N/A' && d.tipo.toLowerCase() !== 'tarefa'
        );

        if (itensValidos.length === 0) {
            this.textoReleaseNotes = 'Nenhuma demanda elegível para Release Notes nesta Sprint.';
            return;
        }

        let texto = "🚀 *Release Notes*\n\n";
        let destaques = 0;
        itensValidos.forEach(item => {
            if (destaques < 2) {
                texto += `❇️ ${item.rn_texto}\n`;
                destaques++;
            } else {
                texto += `▶️ ${item.rn_texto}\n`;
            }
        });
        this.textoReleaseNotes = texto;
    }

    atualizando: boolean = false;

    sincronizarDados(): void {
        this.atualizando = true;

        this.dashboardService.sincronizarJira().subscribe({
            next: () => {
                this.carregarDados();
                this.atualizando = false;
                alert('Painel atualizado com os dados mais recentes do JIRA!');
            },
            error: (err: any) => {
                console.error(err);
                alert('Erro ao sincronizar. Verifique se o servidor Python está rodando na porta 5000.');
                this.atualizando = false;
            }
        });
    }

}