import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { BaseFieldComponent } from '../base-field.component';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea'; // Módulo do PrimeNG para textarea
import { FieldComponent } from '../field-wrapper/field.component'; // Importa a casca

@Component({
    selector: 'app-field-textarea',
    standalone: true,
    imports: [CommonModule, FormsModule, InputTextareaModule, FieldComponent],
    templateUrl: './field-textarea.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FieldTextareaComponent),
            multi: true
        }
    ]
})
export class FieldTextareaComponent extends BaseFieldComponent implements ControlValueAccessor {
    // Propriedades visuais e específicas de textarea
    @Input() value: string = '';
    @Input() placeholder: string = '';
    @Input() rows: number = 3; 
    @Input() autoResize: boolean = false; 
    @Input() resizable: boolean = true;
    
    // Emissor de eventos customizados
    @Output() onBlur = new EventEmitter<FocusEvent>();
    @Output() onFocus = new EventEmitter<FocusEvent>();
    
    onChange: any = () => { };
    onTouched: any = () => { };

    onInput(event: Event): void {
        const inputValue = (event.target as HTMLTextAreaElement).value;
        this.value = inputValue;
        this.onChange(inputValue);
    }

    // Métodos que capturam eventos do DOM e repassam para quem estiver usando o componente
    handleBlur(event: FocusEvent): void {
        this.onTouched(); 
        this.onBlur.emit(event); 
    }

    handleFocus(event: FocusEvent): void {
        this.onFocus.emit(event);
    }

    // ==========================================
    // MÉTODOS DO CONTROL VALUE ACCESSOR
    // ==========================================

    writeValue(value: any): void {
        this.value = value || '';
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