import { CdkStepper } from '@angular/cdk/stepper';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-payment-bancolombia',
  templateUrl: './payment-bancolombia.component.html',
  styleUrls: ['./payment-bancolombia.component.scss']
})
export class PaymentBancolombiaComponent implements OnInit {
  @Input() checkoutForm: FormGroup;
  @Input() appStepper: CdkStepper;

  constructor() { }

  ngOnInit(): void {
  }

}
