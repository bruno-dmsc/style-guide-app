import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { BaseFieldComponent } from '../base-field.component';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { FieldComponent } from '../field-wrapper/field.component';

@Component({
    selector: 'app-field-number',
    standalone: true,
    imports: [CommonModule, FormsModule, InputNumberModule, FieldComponent],
    templateUrl: './field-number.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FieldNumberComponent),
            multi: true
        }
    ]
})
export class FieldNumberComponent extends BaseFieldComponent implements ControlValueAccessor {
    @Input() value: number | null = null;
    @Input() placeholder: string = '';

    // Propriedades específicas para números e moedas
    @Input() unit: string = '';
    @Input() unitPosition: 'left' | 'right' = 'left';
    // Propriedade atalho para casas decimais fixas
    @Input() digits: number = 0;

    // Propriedades opcionais para controle granular
    @Input() minFractionDigits?: number;
    @Input() maxFractionDigits?: number;

    @Input() textAlign: 'left' | 'right' = 'left';

    @Output() onBlur = new EventEmitter<FocusEvent>();
    @Output() onFocus = new EventEmitter<FocusEvent>();

    onChange: any = () => { };
    onTouched: any = () => { };

    // Getters que definem qual valor será usado no HTML
    get computedMinFractionDigits(): number {
        return this.minFractionDigits !== undefined ? this.minFractionDigits : this.digits;
    }

    get computedMaxFractionDigits(): number {
        return this.maxFractionDigits !== undefined ? this.maxFractionDigits : this.digits;
    }

    handleInput(event: any): void {
        this.value = event.value;
        this.onChange(this.value);
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