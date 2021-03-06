import { CdkStepper } from '@angular/cdk/stepper';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-nequi',
  templateUrl: './payment-nequi.component.html',
  styleUrls: ['./payment-nequi.component.scss']
})
export class PaymentNequiComponent implements OnInit {

  @Input() appStepper: CdkStepper;

  constructor() { }

  ngOnInit(): void {
  }

}
