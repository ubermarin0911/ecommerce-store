import { CdkStepper } from '@angular/cdk/stepper';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BasketService } from 'src/app/basket/basket.service';
import { PaymentMethod, UserType } from 'src/app/shared/enums/paymentMethods';
import { Transaction } from 'src/app/shared/models/transaction';
import { CheckoutService } from '../../checkout.service';
import { SelectOption } from '../../../shared/models/selectOption';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-bancolombia',
  templateUrl: './payment-bancolombia.component.html',
  styleUrls: ['./payment-bancolombia.component.scss']
})
export class PaymentBancolombiaComponent implements OnInit {
  @Input() checkoutForm: FormGroup;
  @Input() appStepper: CdkStepper;

  bancolombiaTransferForm: FormGroup;
  transaction: Transaction = new Transaction();

  optionsUserType: SelectOption[] = [];
  pollingRequest : Subscription;

  userType = UserType;

  policyPrivacy: string;

  constructor(private basketService: BasketService,
    private checkoutService: CheckoutService,
    private router: Router) { }

  ngOnInit(): void {

    this.checkoutService.getPresignedAcceptance().subscribe(data => {
      this.policyPrivacy = data.permalink;
    });

    this.initOptions();
    this.createBancolombiaTransferForm();
  }

  

  createBancolombiaTransferForm(){
    this.bancolombiaTransferForm = new FormGroup({
      userType: new FormControl('', Validators.required),
    });
  }

  initOptions(){
    this.optionsUserType.push(new SelectOption(this.userType.Person, "Persona natural"));
    this.optionsUserType.push(new SelectOption("", "Persona jurídica (No disponible aún)", true));
  }

  async submitOrder(){
    // this.loading = true;
    const paymentMethod = PaymentMethod;
    
    const basket = this.basketService.getCurrentBasketValue();

    this.transaction.payment_method = {
      type : paymentMethod.BancolombiaTransfer,
      user_type : this.bancolombiaTransferForm.get('userType').value || this.userType.Person,
      payment_description : "Pago a tienda Plantas Pido",
      sandbox_status : "APPROVED"
    }

    this.transaction.shipping_address = this.checkoutForm.get('addressForm').value;
    this.transaction.basketId = basket.id;
    
    try {
      
      const createdOrder: any = await this.checkoutService.createOrderTransaction(this.transaction);

      this.pollingTransaction(createdOrder.transactionId);

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
  
  private pollingTransaction(transaction_id: string){
    this.pollingRequest = this.checkoutService.pollingTransaction(transaction_id).subscribe(
      (response:any) => {
        if(response.data.payment_method.hasOwnProperty("extra")){
          window.location.assign(response.data.payment_method.extra.async_payment_url);
          this.pollingRequest.unsubscribe();
        }
      },
      error => console.log(error)
    );
  }

}