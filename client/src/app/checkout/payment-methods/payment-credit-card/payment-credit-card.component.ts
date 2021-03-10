import { CdkStepper } from '@angular/cdk/stepper';
import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from 'src/app/shared/models/basket';
import { Transaction } from 'src/app/shared/models/transaction';
import { CheckoutService } from '../../checkout.service';
import { PaymentMethod } from '../../../shared/enums/paymentMethods';

var valid = require("card-validator");

@Component({
  selector: 'app-payment-credit-card',
  templateUrl: './payment-credit-card.component.html',
  styleUrls: ['./payment-credit-card.component.scss']
})

export class PaymentCreditCardComponent implements OnInit {
  @Input() appStepper: CdkStepper;
  @Input() checkoutForm: FormGroup;

  creditCardForm: FormGroup;
  
  transaction: Transaction = new Transaction();

  constructor(private checkoutService: CheckoutService,
    private toastr: ToastrService, 
    private basketService: BasketService) { }

  ngOnInit(): void {

    this.createCreditCardForm();

    var numberValidation = valid.number("30569309025904");
 
    if (!numberValidation.isPotentiallyValid) {
      console.log("INVALIDO");
    }
    
    if (numberValidation.card) {
      // console.log(numberValidation.card.type);
    }
  }

  createCreditCardForm(){
    this.creditCardForm = new FormGroup({
      cardNumber: new FormControl('', Validators.required),
      card_holder: new FormControl('', Validators.required),
      exp_month: new FormControl('', Validators.required),
      exp_year: new FormControl('', Validators.required),
      cvc: new FormControl('', Validators.required),
      installments: new FormControl('', Validators.required)
    });
  }

  async submitOrder(){

  } 

}