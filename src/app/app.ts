import { Component, AfterViewInit, OnDestroy, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressSpinnerModule } from 'primeng/progressspinner';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, InputTextModule, TableModule, FileUploadModule, ProgressSpinnerModule],
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

}