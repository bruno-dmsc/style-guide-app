import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gauge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gauge.component.html'
})
export class GaugeComponent {
  @Input() value: number = 0;
  @Input() label: string = '';
  @Input() target: number | null = null; 
  
  // Cores
  @Input() valueColor: string = 'var(--verde-600)'; 
  @Input() trackColor: string = 'var(--fundo-200)';
  @Input() targetColor: string = 'var(--fundo-900)';
  
  // NOVOS: Parâmetros dimensionais (Proporção do desenho interno)
  @Input() radius: number = 80;
  @Input() strokeWidth: number = 16;
  
  @Input() valueFormatter: (val: number) => string = (val) => val.toFixed(0).replace('.', ',');
  
  get formattedValue(): string {
    return this.valueFormatter(this.value);
  }

  get targetDashArray(): string {
    if (this.target === null) return '';
    return `0 ${this.target - 1} 2 100`; 
  }

  // ==========================================
  // CÁLCULOS DINÂMICOS DO SVG
  // ==========================================

  // Calcula o tamanho da "caixa" do desenho para não cortar as bordas
  get viewBox(): string {
    const width = (this.radius * 2) + this.strokeWidth;
    const height = this.radius + (this.strokeWidth / 2);
    return `0 0 ${width} ${height + 10}`; // +10 para dar um respiro extra embaixo do texto
  }

  // Calcula o caminho (path) do meio-círculo perfeito
  get pathD(): string {
    const startX = this.strokeWidth / 2;
    const endX = (this.radius * 2) + startX;
    const cy = this.radius + (this.strokeWidth / 2);
    
    // M = Mover para o início | A = Desenhar Arco (RaioX RaioY Rotação Eixo Direção DestinoX DestinoY)
    return `M ${startX} ${cy} A ${this.radius} ${this.radius} 0 0 1 ${endX} ${cy}`;
  }

  // Calcula o centro X para centralizar os textos perfeitamente
  get centerX(): number {
    return this.radius + (this.strokeWidth / 2);
  }

  // Calcula a altura da label
  get labelY(): number {
    return this.radius * 0.70; 
  }

  // Calcula a altura do valor
  get valueY(): number {
    return this.radius * 1.05; 
  }
}