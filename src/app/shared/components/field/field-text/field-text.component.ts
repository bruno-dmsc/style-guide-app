import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { BaseFieldComponent } from '../base-field.component';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext'; 
import { InputMaskModule } from 'primeng/inputmask'; // NOVO: Módulo de máscara
import { FieldComponent } from '../field-wrapper/field.component'; 

@Component({
    selector: 'app-field-text',
    standalone: true,
    imports: [CommonModule, FormsModule, InputTextModule, InputMaskModule, FieldComponent], // Adicionado InputMaskModule
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
    // Propriedades visuais originais
    @Input() value: string = '';
    @Input() placeholder: string = '';
    
    // NOVAS: Propriedades da Máscara
    @Input() mask: string = ''; 
    @Input() slotChar: string = '_'; 
    @Input() unmask: boolean = true; 
    
    // Emissor de eventos customizados
    @Output() onBlur = new EventEmitter<FocusEvent>();
    @Output() onFocus = new EventEmitter<FocusEvent>();
    
    onChange: any = () => { };
    onTouched: any = () => { };

    // Atualizado para lidar com os dois cenários (input normal e PrimeNG mask)
    onInput(event: any): void {
        // Se vier de um input nativo, event.target existe. Se vier do ngModelChange da máscara, o event já é o próprio valor string.
        const inputValue = event.target ? (event.target as HTMLInputElement).value : event;
        this.value = inputValue;
        this.onChange(inputValue);
    }

    handleBlur(event: any): void {
        this.onTouched(); 
        this.onBlur.emit(event.originalEvent || event); 
    }

    handleFocus(event: any): void {
        this.onFocus.emit(event.originalEvent || event);
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