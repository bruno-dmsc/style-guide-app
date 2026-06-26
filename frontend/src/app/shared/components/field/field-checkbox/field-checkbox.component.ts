import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { BaseFieldComponent } from '../base-field.component';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox'; 
import { FieldComponent } from '../field-wrapper/field.component'; 

@Component({
    selector: 'app-field-checkbox',
    standalone: true,
    imports: [CommonModule, FormsModule, CheckboxModule, FieldComponent],
    templateUrl: './field-checkbox.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FieldCheckboxComponent),
            multi: true
        }
    ]
})
export class FieldCheckboxComponent extends BaseFieldComponent implements ControlValueAccessor {
    // O valor do checkbox múltiplo é sempre um array
    @Input() value: any[] = [];
    
    @Input() options: any[] = [];
    @Input() optionLabel: string = 'label';
    @Input() optionValue: string = 'value';
    @Input() layout: 'horizontal' | 'vertical' = 'vertical';

    // Nome único para garantir o isolamento acessível de cada grupo gerado
    uniqueGroupName: string = `checkbox-group-${Math.random().toString(36).substring(2, 9)}`;

    onChange: any = () => { };
    onTouched: any = () => { };

    handleSelect(event: any): void {
        // O ngModel da tag p-checkbox já atualiza o array internamente
        this.onChange(this.value);
    }

    // ==========================================
    // MÉTODOS DO CONTROL VALUE ACCESSOR
    // ==========================================
    writeValue(value: any): void {
        this.value = value || [];
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