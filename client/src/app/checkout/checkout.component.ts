import { Component, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from '../account/account.service';
import { BasketService } from '../basket/basket.service';
import { Observable } from 'rxjs';
import { IBasketTotals } from '../shared/models/basket';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  basketTotals$: Observable<IBasketTotals>;
  checkoutForm: FormGroup;
  paymentMethodSelected: string;

  constructor(
    private fb: FormBuilder, 
    private accountService: AccountService, 
    private basketService: BasketService) { }

  ngOnInit() {
    this.createCheckoutForm();
    this.getAddressFormValues();
    this.getDeliveryMethodValue();
    this.basketTotals$ = this.basketService.basketTotal$;
  }

  createCheckoutForm() {
    this.checkoutForm = this.fb.group({
      addressForm: this.fb.group({
        address_line_1: [null, Validators.required],
        name: [null, Validators.required],
        city: [null, Validators.required],
        phone_number: [null, Validators.required],
      }),
      deliveryForm: this.fb.group({
        deliveryMethod: [null, Validators.required]
      }),
      paymentForm: this.fb.group({
        nameOnCard: [null, Validators.required]
      })
    });
  }

  getAddressFormValues() {
    this.accountService.getUserAddress().subscribe(address => {
      if (address) {
        this.checkoutForm.get('addressForm').patchValue(address);
      }
    }, error => {
      console.log(error);
    });
  }

  getDeliveryMethodValue(){
    const basket = this.basketService.getCurrentBasketValue();
    // if(basket.deliveryMethodId !== null){
    //   this.checkoutForm.get('deliveryForm').get('deliveryMethod').patchValue(
    //     basket.deliveryMethodId.toString()
    //   );
    // }
  }

  onPaymentMethodSelected(paymentMethod: string){
    // console.log(paymentMethod);
    this.paymentMethodSelected = paymentMethod;
  }

}