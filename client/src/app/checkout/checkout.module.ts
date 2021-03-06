import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutComponent } from './checkout.component';
import { CheckoutRoutingModule } from './checkout-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CheckoutAddressComponent } from './checkout-address/checkout-address.component';
import { CheckoutDeliveryComponent } from './checkout-delivery/checkout-delivery.component';
import { CheckoutReviewComponent } from './checkout-review/checkout-review.component';
import { CheckoutPaymentComponent } from './checkout-payment/checkout-payment.component';
import { CheckoutSuccessComponent } from './checkout-success/checkout-success.component';
import { PaymentCreditCardComponent } from './payment-methods/payment-credit-card/payment-credit-card.component';
import { PaymentNequiComponent } from './payment-methods/payment-nequi/payment-nequi.component';
import { PaymentPseComponent } from './payment-methods/payment-pse/payment-pse.component';
import { PaymentBancolombiaComponent } from './payment-methods/payment-bancolombia/payment-bancolombia.component';

@NgModule({
  declarations: [CheckoutComponent, 
    CheckoutAddressComponent, 
    CheckoutDeliveryComponent, 
    CheckoutReviewComponent, 
    CheckoutPaymentComponent, 
    CheckoutSuccessComponent,
    PaymentCreditCardComponent,
    PaymentNequiComponent,
    PaymentPseComponent,
    PaymentBancolombiaComponent,
  ],
  imports: [
    CommonModule,
    CheckoutRoutingModule,
    SharedModule,
  ]
})
export class CheckoutModule { }
