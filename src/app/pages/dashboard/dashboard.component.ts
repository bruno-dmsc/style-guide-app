import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';


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
    demandasDaSprint: any[] = []; // Usamos any para incluir os campos calculados

    // Configuração das colunas conforme solicitado
    colunasTabela: TableColumn[] = [
        { field: 'chave', header: 'NÚMERO', minWidth: '110px' },
        { field: 'resumo', header: 'RESUMO/TÍTULO', minWidth: '250px' },
        { field: 'rn_texto', header: 'RELEASE NOTES', minWidth: '250px' },
        { field: 'tipo', header: 'TIPO', minWidth: '100px' },
        { field: 'dias_resolver', header: 'DIAS P/ RESOLVER', align: 'center', minWidth: '140px' },
        { field: 'no_prazo', header: 'NO PRAZO', align: 'center', minWidth: '100px' },
        { field: 'resolucao', header: 'CONCLUSÃO', minWidth: '130px' },
        { field: 'responsavel', header: 'RESPONSÁVEL', minWidth: '150px' },
        { field: 'projeto', header: 'PROJETO', minWidth: '100px' }
    ];

    totalEntregas = 0;
    totalCorrecoes = 0;
    totalMelhorias = 0;
    totalTarefas = 0;
    textoReleaseNotes = '';

    // Novas métricas de percentagem
    percNoPrazo: number = 0;
    percSemRetrabalho: number = 0;
    percSlaBugs: number = 0;

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

                // Chama a função diretamente, sem o setTimeout
                if (this.sprintSelecionada) {
                    this.onSprintChange();
                }

                // Avisa o Angular para desenhar a tela com todos os cálculos já feitos!
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Erro ao carregar dados', err)
        });
    }

    onSprintChange(): void {
        if (!this.sprintSelecionada) return;

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
                    no_prazo: d.resolvido ? 'Sim' : 'Não', // Lógica provisória
                    projeto: d.tipo.toLowerCase() === 'tarefa' ? 'Não' : 'Sim'
                };
            });

        // 1. Cálculo de KPIs Quantitativos
        this.totalEntregas = this.demandasDaSprint.length;
        const bugs = this.demandasDaSprint.filter(d =>
            ['correção', 'bug', 'correcao'].includes(d.tipo.toLowerCase())
        );
        this.totalCorrecoes = bugs.length;
        this.totalMelhorias = this.demandasDaSprint.filter(d => d.tipo.toLowerCase() === 'melhoria').length;
        this.totalTarefas = this.demandasDaSprint.filter(d => d.tipo.toLowerCase() === 'tarefa').length;

        // 2. Cálculo das Percentagens (Métricas da Sprint)
        if (this.totalEntregas > 0) {
            // % No Prazo
            const noPrazoCount = this.demandasDaSprint.filter(d => d.no_prazo === 'Sim').length;
            this.percNoPrazo = Math.round((noPrazoCount / this.totalEntregas) * 100);

            // % Sem Retrabalho (retornos_teste === 0)
            const semRetrabalhoCount = this.demandasDaSprint.filter(d => d.retornos_teste === 0).length;
            this.percSemRetrabalho = Math.round((semRetrabalhoCount / this.totalEntregas) * 100);
        }

        // % SLA Bugs em Produção (Apenas para o tipo Bug)
        if (this.totalCorrecoes > 0) {
            const bugsNoPrazo = bugs.filter(b => b.no_prazo === 'Sim').length;
            this.percSlaBugs = Math.round((bugsNoPrazo / this.totalCorrecoes) * 100);
        } else {
            this.percSlaBugs = 0;
        }

        this.gerarTextoRN();
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

        // Agora usamos o service que já tem o HttpClient embutido
        this.dashboardService.sincronizarJira().subscribe({
            next: () => {
                this.carregarDados();
                this.atualizando = false;
                alert('Painel atualizado com os dados mais recentes do JIRA!');
            },
            error: (err: any) => { // <-- O ": any" resolve o erro TS7006
                console.error(err);
                alert('Erro ao sincronizar. Verifique se o servidor Python está rodando na porta 5000.');
                this.atualizando = false;
            }
        });
    }

}