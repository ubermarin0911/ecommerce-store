import { Component, ElementRef, Input, OnInit, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-wompi-policy-privacy',
  templateUrl: './wompi-policy-privacy.component.html',
  styleUrls: ['./wompi-policy-privacy.component.scss']
})
export class WompiPolicyPrivacyComponent implements OnInit, ControlValueAccessor {
  @ViewChild('input', {static: true}) input: ElementRef;
  @Input() policyPrivacy: string;

  constructor(@Self() public controlDir: NgControl) {
    this.controlDir.valueAccessor = this;
   }

  ngOnInit(): void {
    const control = this.controlDir.control;
    const validators = control.validator ? [control.validator] : [];

    control.setValidators(validators);
    control.updateValueAndValidity();
  }

  writeValue(obj: any): void {
    this.input.nativeElement.value = obj || '';
  }

  onChange(event){
    this.input.nativeElement.value = event;
  }

  onTouched(){
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}