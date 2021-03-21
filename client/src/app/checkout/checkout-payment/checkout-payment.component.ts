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
export class CheckoutPaymentComponent implements OnInit{
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

  ngOnInit(){
  }


  openPaymentMethod(paymentMethod: string){
    this.paymentMethodSelected.emit(paymentMethod);
    this.appStepper.next();
  }

}