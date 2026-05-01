import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { BaseFieldComponent } from '../base-field.component';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext'; // Importe o módulo do PrimeNG
import { FieldComponent } from '../field-wrapper/field.component'; // Importa a casca

@Component({
    selector: 'app-field-text',
    standalone: true,
    imports: [CommonModule, FormsModule, InputTextModule, FieldComponent],
    templateUrl: './field-text.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FieldTextComponent),
            multi: true
        }
    ]
})
export class FieldTextComponent extends BaseFieldComponent implements ControlValueAccessor {
    // Propriedades visuais
    @Input() value: string = '';
    @Input() placeholder: string = '';
    
    // Emissor de eventos customizados
    @Output() onBlur = new EventEmitter<FocusEvent>();
    @Output() onFocus = new EventEmitter<FocusEvent>();
    
    onChange: any = () => { };
    onTouched: any = () => { };

    onInput(event: Event): void {
        const inputValue = (event.target as HTMLInputElement).value;
        this.value = inputValue;
        this.onChange(inputValue);
    }

    // Métodos que capturam eventos do DOM e repassam para quem estiver usando o componente
    handleBlur(event: FocusEvent): void {
        this.onTouched(); // Avisa o Angular Forms que o campo foi tocado
        this.onBlur.emit(event); // Emite o evento para o componente pai, se ele quiser escutar
    }

    handleFocus(event: FocusEvent): void {
        this.onFocus.emit(event);
    }

    // ==========================================
    // MÉTODOS DO CONTROL VALUE ACCESSOR
    // ==========================================

    // Recebe o valor inicial do formControl
    writeValue(value: any): void {
        this.value = value || '';
    }

    // Registra a função de mudança
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    // Registra a função de blur (quando o campo perde o foco)
    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    // Define se o campo deve ficar desabilitado
    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}