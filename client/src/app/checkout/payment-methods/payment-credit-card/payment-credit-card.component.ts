import { CdkStepper } from '@angular/cdk/stepper';
import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from 'src/app/shared/models/basket';
import { Transaction } from 'src/app/shared/models/transaction';
import { CheckoutService } from '../../checkout.service';
import { ICreditCardData } from '../../../shared/models/transaction';
import { PaymentMethod } from 'src/app/shared/enums/paymentMethods';

var valid = require("card-validator");

@Component({
  selector: 'app-payment-credit-card',
  templateUrl: './payment-credit-card.component.html',
  styleUrls: ['./payment-credit-card.component.scss']
})

export class PaymentCreditCardComponent implements OnInit {
  @Input() appStepper: CdkStepper;
  @Input() checkoutForm: FormGroup;
  policyPrivacy: string;

  creditCardForm: FormGroup;
  
  transaction: Transaction = new Transaction();

  constructor(private checkoutService: CheckoutService,
    private toastr: ToastrService, 
    private basketService: BasketService) { }

  ngOnInit(): void {
    
    this.checkoutService.getPresignedAcceptance().subscribe(data => {
      this.policyPrivacy = data.permalink;
    });

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
      number: new FormControl('4242424242424242', Validators.required),
      card_holder: new FormControl('Nombre persona', Validators.required),
      exp_month: new FormControl('08', Validators.required),
      exp_year: new FormControl('28', Validators.required),
      cvc: new FormControl('123', Validators.required),
      installments: new FormControl(1, Validators.required)
    });
  }

  async submitOrder(){

   const creditCardData: ICreditCardData = {
     card_holder : this.getCreditCardValueForm('card_holder'),
     number : this.getCreditCardValueForm('number'),
     exp_month : this.getCreditCardValueForm('exp_month'),
     exp_year : this.getCreditCardValueForm('exp_year'),
     cvc : this.getCreditCardValueForm('cvc')
   }

   const basket = this.basketService.getCurrentBasketValue();
   const paymentMethod = PaymentMethod;
   
   try {
    const tokenData: any = await this.checkoutService.tokenizeCreditCard(creditCardData);
    
    this.transaction.payment_method = {
      type : paymentMethod.CreditCard,
      installments : this.getCreditCardValueForm('installments'),
      token : tokenData.data.id
    }
    this.transaction.shipping_address = this.checkoutForm.get('addressForm').value;
    this.transaction.basketId = basket.id;
    const createdOrder = await this.checkoutService.createOrderTransaction(this.transaction);

    console.log(createdOrder);
    // const paymentResult = await this.confirmPaymentWithStripe(basket);
    // if (paymentResult.paymentIntent) {
    //   this.basketService.deleteLocalBasket(basket.id);
    //   const navigationExtras: NavigationExtras = { state: createdOrder };
    //   this.router.navigate(['checkout/success'], navigationExtras);
    // } else {
    //   this.toastr.error(paymentResult.error.message);
    // }
    // this.loading = false;
  } catch (error) {
    this.toastr.error("No se pudo realizar la compra. Verifique los datos ingresados.");
    if(error.errors){
      for (const err of error.errors) {
        this.toastr.error(err);
      }
    }
  }
  } 

  getCreditCardValueForm(fieldname: string){
    return this.creditCardForm.get(fieldname).value;
  }

}