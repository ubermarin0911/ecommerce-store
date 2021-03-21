import { CdkStepper } from '@angular/cdk/stepper';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BasketService } from 'src/app/basket/basket.service';
import { PaymentMethod } from 'src/app/shared/enums/paymentMethods';
import { Transaction } from 'src/app/shared/models/transaction';
import { CheckoutService } from '../../checkout.service';

@Component({
  selector: 'app-payment-nequi',
  templateUrl: './payment-nequi.component.html',
  styleUrls: ['./payment-nequi.component.scss']
})
export class PaymentNequiComponent implements OnInit {
  @Input() checkoutForm: FormGroup;
  @Input() appStepper: CdkStepper;

  nequiForm: FormGroup;
  transaction: Transaction = new Transaction();

  policyPrivacy: string;

  constructor(private basketService: BasketService,
    private checkoutService: CheckoutService) { }

  ngOnInit(): void {
    this.checkoutService.getPresignedAcceptance().subscribe(data => {
      this.policyPrivacy = data.permalink;
    });
    this.createNequiForm();
  }

  createNequiForm(){
    this.nequiForm = new FormGroup({
      phoneNumber: new FormControl('', Validators.required),
    });
  }
  
  async submitOrder(){
    // this.loading = true;
    const paymentMethod = PaymentMethod;

    const basket = this.basketService.getCurrentBasketValue();

    this.transaction.payment_method = {
      type : paymentMethod.Nequi,
      phone_number : this.nequiForm.get('phoneNumber').value
    }

    this.transaction.shipping_address = this.checkoutForm.get('addressForm').value;
    this.transaction.basketId = basket.id;

    try {
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
      console.log(error);
    }
  } 


}
