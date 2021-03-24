import { CdkStepper } from '@angular/cdk/stepper';
import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/basket/basket.service';
import { Transaction } from 'src/app/shared/models/transaction';
import { CheckoutService } from '../../checkout.service';
import { ICreditCardData } from '../../../shared/models/transaction';
import { PaymentMethod } from 'src/app/shared/enums/paymentMethods';
import { Router } from '@angular/router';

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
    private router: Router,
    private toastr: ToastrService, 
    private basketService: BasketService) { }

  ngOnInit(): void {
    
    this.checkoutService.getPresignedAcceptance().subscribe(data => {
      this.policyPrivacy = data.permalink;
    });

    this.createCreditCardForm();
  }

  createCreditCardForm(){
    this.creditCardForm = new FormGroup({
      number: new FormControl('', Validators.required),
      card_holder: new FormControl('', Validators.required),
      exp_month: new FormControl('', Validators.required),
      exp_year: new FormControl('', Validators.required),
      cvc: new FormControl('', Validators.required),
      installments: new FormControl(1, Validators.required),
      policyPrivacyAccepted: new FormControl(false, [Validators.required,
      Validators.requiredTrue])
    });
  }

  async submitOrder(){
    
    if(this.creditCardForm.invalid) {
      this.creditCardForm.setErrors({ ...this.creditCardForm.errors, 'invalidForm': true });
      return;
    }

   const creditCardData: ICreditCardData = {
     card_holder : this.getCreditCardValueForm('card_holder'),
     number : this.getCreditCardValueForm('number').replace(/\s/g, ''),
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
    this.router.navigateByUrl(`/checkout/pedido?id=${createdOrder['transactionId']}`);
    
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

  onCardChange(cardTarget: any){
    let position = cardTarget.selectionEnd;
    let value = cardTarget.value;
    let length = value.length;

    value = value.replace(/[^\d]/g, '').replace(/(.{4})/g, '$1 ').trim();

    cardTarget.selectionEnd = position += ((value.charAt(position - 1) === ' ' && value.charAt(length - 1) === ' ' && length !== value.length) ? 1 : 0);
    
    this.setValuesForm({number: value});
  }

  setValuesForm(values : any){
    this.creditCardForm.patchValue(values)
  }

}