import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { BaseFieldComponent } from '../base-field.component';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton'; 
import { FieldComponent } from '../field-wrapper/field.component'; 

@Component({
    selector: 'app-field-radio',
    standalone: true,
    imports: [CommonModule, FormsModule, RadioButtonModule, FieldComponent],
    templateUrl: './field-radio.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FieldRadioComponent),
            multi: true
        }
    ]
})
export class FieldRadioComponent extends BaseFieldComponent implements ControlValueAccessor {
    @Input() value: any = null;
    
    @Input() options: any[] = [];
    @Input() optionLabel: string = 'label';
    @Input() optionValue: string = 'value';
    @Input() layout: 'horizontal' | 'vertical' = 'vertical';

    // Gera um nome único para agrupar os radios nativamente no HTML, evitando conflitos
    uniqueGroupName: string = `radio-group-${Math.random().toString(36).substring(2, 9)}`;

    onChange: any = () => { };
    onTouched: any = () => { };

    handleSelect(event: any): void {
        this.value = event.value;
        this.onChange(this.value);
    }

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