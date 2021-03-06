import { CdkStepper } from '@angular/cdk/stepper';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-bancolombia',
  templateUrl: './payment-bancolombia.component.html',
  styleUrls: ['./payment-bancolombia.component.scss']
})
export class PaymentBancolombiaComponent implements OnInit {

  @Input() appStepper: CdkStepper;

  constructor() { }

  ngOnInit(): void {
  }

}
