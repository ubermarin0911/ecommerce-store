import { Self, ViewChild, Component, OnInit, Input, ElementRef } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { SelectOption } from '../../models/selectOption';

@Component({
  selector: 'app-select-input',
  templateUrl: './select-input.component.html',
  styleUrls: ['./select-input.component.scss']
})
export class SelectInputComponent implements OnInit, ControlValueAccessor  {

  @ViewChild('selectElement', {static: true}) select: ElementRef;
  @Input() label: string;
  @Input() options: SelectOption[];

  constructor(@Self() public controlDir: NgControl) {
    this.controlDir.valueAccessor = this;
  }
  
  ngOnInit(): void {
    const control = this.controlDir.control;
    const validators = control.validator ? [control.validator] : [];
    const asyncValidators = control.asyncValidator ? [control.asyncValidator] : [];

    control.setValidators(validators);
    control.setAsyncValidators(asyncValidators);
    control.updateValueAndValidity();
  }

  writeValue(obj: any): void {
    this.select.nativeElement.value = obj || '';
  }

  onChange(event){
  }

  onTouched(){}

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
