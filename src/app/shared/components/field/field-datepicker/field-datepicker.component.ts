import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { BaseFieldComponent } from '../base-field.component';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar'; 
import { FieldComponent } from '../field-wrapper/field.component';

@Component({
    selector: 'app-field-datepicker',
    standalone: true,
    imports: [CommonModule, FormsModule, CalendarModule, FieldComponent],
    templateUrl: './field-datepicker.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FieldDatepickerComponent),
            multi: true
        }
    ]
})
export class FieldDatepickerComponent extends BaseFieldComponent implements ControlValueAccessor {
    @Input() value: any = null; 
    
    @Input() placeholder: string = 'dd/mm/aaaa';
    @Input() showTime: boolean = false;
    @Input() selectionMode: 'single' | 'multiple' | 'range' = 'single';
    @Input() minDate: Date | null = null;
    @Input() maxDate: Date | null = null;
    @Input() showClear: boolean = true;

    @Output() onBlur = new EventEmitter<Event>();
    @Output() onFocus = new EventEmitter<Event>();

    onChange: any = () => { };
    onTouched: any = () => { };

    // Objeto de tradução para pt-BR
    ptBR: any = {
        firstDayOfWeek: 0,
        dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
        dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
        dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sá'],
        monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        today: 'Hoje',
        clear: 'Limpar'
    };

    // Máscara que converte "11092001" para "11/09/2001" em tempo real
    aplicarMascara(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (!input) return;

        let valor = input.value.replace(/\D/g, ''); // Remove tudo que não é número

        if (valor.length > 8) {
            valor = valor.substring(0, 8);
        }

        if (valor.length > 4) {
            valor = valor.replace(/^(\d{2})(\d{2})(\d+)/, '$1/$2/$3');
        } else if (valor.length > 2) {
            valor = valor.replace(/^(\d{2})(\d+)/, '$1/$2');
        }

        input.value = valor;
    }

    handleSelect(event: any): void {
        this.onChange(this.value);
    }

    handleClear(): void {
        this.value = null;
        this.onChange(this.value);
    }

    handleBlur(event: any): void {
        this.onTouched();
        this.onBlur.emit(event);
    }

    handleFocus(event: any): void {
        this.onFocus.emit(event);
    }

    // ==========================================
    // MÉTODOS DO CONTROL VALUE ACCESSOR
    // ==========================================
    writeValue(value: any): void {
        this.value = value;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}