import { CdkStepper } from '@angular/cdk/stepper';
import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { IPresignedAcceptance } from 'src/app/shared/models/merchant';
import { Transaction } from 'src/app/shared/models/transaction';
import { CheckoutService } from '../../checkout.service';

var valid = require("card-validator");

@Component({
  selector: 'app-payment-credit-card',
  templateUrl: './payment-credit-card.component.html',
  styleUrls: ['./payment-credit-card.component.scss']
})

export class PaymentCreditCardComponent implements OnInit {
  @Input() appStepper: CdkStepper;

  creditCardForm: FormGroup;
  
  acceptanceToken$: Observable<IPresignedAcceptance>;

  transaction: Transaction = new Transaction();

  constructor(private checkoutService: CheckoutService) { }

  ngOnInit(): void {
    this.acceptanceToken$ = this.checkoutService.acceptanceToken$;

    this.getAcceptanceToken();
    this.createCreditCardForm();

    var numberValidation = valid.number("30569309025904");
 
    if (!numberValidation.isPotentiallyValid) {
      console.log("INVALIDO");
    }
    
    if (numberValidation.card) {
      // console.log(numberValidation.card.type);
    }
  }

  getAcceptanceToken(){
    this.acceptanceToken$.subscribe((presignedAcceptance)=> {
      this.transaction.acceptance_token = presignedAcceptance.acceptance_token;
      console.log(this.transaction);
      
    }, error => {
      console.log(error);
    });
  }

  generateReference(){
    
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

  onSubmitTransaction(){
    this.transaction.amount_in_cents = 17500000;
    this.transaction.currency = "COP";
    this.transaction.customer_email = "user@example.com";
    this.transaction.reference = "ad2sd3ddsdsd2asa";
    this.transaction.payment_method.type = "NEQUI";
    this.transaction.payment_method.phone_number = "3991111111";

    this.checkoutService.createTransaction(this.transaction).subscribe((data) => {

    }, error => {

    });
  }

}