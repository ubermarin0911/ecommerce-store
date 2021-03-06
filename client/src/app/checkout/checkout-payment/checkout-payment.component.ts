import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BasketService } from '../../basket/basket.service';
import { CheckoutService } from '../checkout.service';
import { ToastrService } from 'ngx-toastr';
import { IBasket } from 'src/app/shared/models/basket';
import { Router } from '@angular/router';
import { public_key } from '../../../../wompi_keys/public_key';
import { CdkStepper } from '@angular/cdk/stepper';
import { Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

declare var WidgetCheckout;

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements OnInit, OnDestroy {
  @Input() checkoutForm: FormGroup;
  @Input() totalPriceOrder: number;
  @Input() appStepper: CdkStepper;

  @Output() paymentMethodSelected = new EventEmitter<string>();

  loading = false;

  checkout : any;

  constructor(
    private basketService: BasketService, 
    private checkoutService: CheckoutService,
    private toastr: ToastrService, 
    private router: Router) {
     }

  ngOnDestroy(): void {
  }

  ngOnInit(){
  
  }

  async submitOrder(){
    this.loading = true;
    const basket = this.basketService.getCurrentBasketValue();
  } 

  private async createOrder(basket: IBasket) {
    const orderToCreate = this.getOrderToCreate(basket);

    return this.checkoutService.createOrder(orderToCreate).toPromise();
  }

  private generateReferenceOrder(){
    
  }

  private getOrderToCreate(basket: IBasket) {
    return {
       basketId: basket.id,
       deliveryMethodId: +this.checkoutForm.get('deliveryForm').get('deliveryMethod').value,
       shipToAddress: this.checkoutForm.get('addressForm').value
    };
  }

  openCheckout(){
    
    // this.checkout = new WidgetCheckout({
    //   currency: 'COP',
    //   amountInCents: Number(`${this.totalPriceOrder}00`),
    //   reference: 'AD0029dsd2sdsdsdedsdsd01221',
    //   publicKey: this.wompi_public_key
    // });

    // this.checkout.open(function ( result ) {
    //   var transaction = result.transaction
    //   console.log('Transaction ID: ', transaction.id)
    //   console.log('Transaction object: ', transaction)
    // });
  }

  openPaymentMethod(paymentMethod: string){
    this.paymentMethodSelected.emit(paymentMethod);
    this.appStepper.next();
  }

}