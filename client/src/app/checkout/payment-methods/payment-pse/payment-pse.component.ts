import { CdkStepper } from '@angular/cdk/stepper';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-payment-pse',
  templateUrl: './payment-pse.component.html',
  styleUrls: ['./payment-pse.component.scss']
})
export class PaymentPseComponent implements OnInit {
  @Input() checkoutForm: FormGroup;
  @Input() appStepper: CdkStepper;

  constructor() { }

  ngOnInit(): void {
  }

}
