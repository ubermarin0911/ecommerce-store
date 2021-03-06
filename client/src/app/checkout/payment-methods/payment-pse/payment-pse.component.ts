import { CdkStepper } from '@angular/cdk/stepper';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-pse',
  templateUrl: './payment-pse.component.html',
  styleUrls: ['./payment-pse.component.scss']
})
export class PaymentPseComponent implements OnInit {
  @Input() appStepper: CdkStepper;

  constructor() { }

  ngOnInit(): void {
  }

}
