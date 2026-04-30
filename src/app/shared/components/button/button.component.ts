import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BaseUIComponent } from '../base-ui.component';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

// Restringimos as opções para blindar o Design System do Desmonte
type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
type ButtonColor = 'default' | 'success' | 'warning' | 'danger' | 'help';
type PrimeButtonSeverity = 'success' | 'info' | 'warning' | 'danger' | 'help' | 'primary' | 'secondary' | 'contrast' | undefined;

@Component({
    selector: 'app-button',
    standalone: true,
    imports: [CommonModule, ButtonModule],
    templateUrl: './button.component.html'
})
export class ButtonComponent extends BaseUIComponent {
    // Parâmetros que a equipe vai utilizar
    @Input() label: string = '';
    @Input() icon: string = '';
    @Input() variant: ButtonVariant = 'primary'; // Padrão é sólido
    @Input() color: ButtonColor = 'default';     // Padrão é a cor principal
    @Input() disabled: boolean = false;
    @Input() fullWidth: boolean = false;         // Substitui a necessidade da classe w-full
    @Input() type: 'button' | 'submit' | 'reset' = 'button';

    @Input() override customStyle: { [klass: string]: any } | null = {'margin-bottom': 'var(--spacing-s)'};

    // Emissor do evento de clique
    @Output() onClick = new EventEmitter<MouseEvent>();

    // ==========================================
    // TRADUTORES PARA O PRIMENG
    // ==========================================

    get computedSeverity(): PrimeButtonSeverity {
        // Tratativa específica para o botão secundário padrão
        if (this.color === 'default' && this.variant === 'secondary') {
            return 'secondary';
        }

        // Se for default (para os primários ou terciários), retorna undefined para usar o azul base
        if (this.color === 'default') {
            return undefined;
        }

        // Como as nossas cores batem exatamente com as do PrimeNG, só fazemos um "cast" (as)
        // para tranquilizar o compilador do TypeScript
        return this.color as PrimeButtonSeverity;
    }

    get isOutlined(): boolean {
        // É outline se for secundário e a cor não for a default (pois a default já é tratada pelo severity='secondary')[cite: 6]
        return this.variant === 'secondary' && this.color !== 'default';
    }

    get isText(): boolean {
        // Terciário é sempre Ghost/Text[cite: 6]
        return this.variant === 'tertiary';
    }
}