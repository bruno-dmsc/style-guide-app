import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Nossas interfaces de tipagem
export interface Sprint {
  id: number;
  name: string;
  state: string;
  startDate: string;
  endDate: string;
  completeDate?: string;
}

export interface Demanda {
  chave: string;
  tipo: string;
  resumo: string;
  status: string;
  resolucao: string;
  responsavel: string;
  cliente: string;
  criado: string;
  resolvido: string;
  data_limite?: string;
  retornos_teste: number;
  rn_texto: string;
  sprint_id: number;
  no_prazo?: string;
}

export interface SprintDataPayload {
  sprints: Sprint[];
  demandas: Demanda[];
}

@Injectable({
  providedIn: 'root'
})
export class SprintDashboardService {
  private http = inject(HttpClient);

  getSprintData(): Observable<SprintDataPayload> {
    // Caminho para o arquivo estático na pasta public/assets
    return this.http.get<SprintDataPayload>('/assets/sprint-data.json');
  }

  sincronizarJira(): Observable<any> {
    return this.http.post('http://localhost:5000/api/atualizar', {});
  }

  preencherReleaseNotes(sprintId: number): Observable<any> {
    return this.http.post(`http://localhost:5000/api/preencher-rn/${sprintId}`, {});
  }
}