import { CdkStepper } from '@angular/cdk/stepper';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BasketService } from 'src/app/basket/basket.service';
import { PaymentMethod, UserType } from 'src/app/shared/enums/paymentMethods';
import { Transaction } from 'src/app/shared/models/transaction';
import { CheckoutService } from '../../checkout.service';
import { SelectOption } from '../../../shared/models/selectOption';

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

  userType = UserType;

  constructor(private basketService: BasketService,
    private checkoutService: CheckoutService) { }

  ngOnInit(): void {
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
    this.transaction.payment_method.type = paymentMethod.BancolombiaTransfer;
    this.transaction.payment_method.user_type = this.bancolombiaTransferForm.get('userType').value || this.userType.Person;
    this.transaction.payment_method.sandbox_status = "APPROVED";
    this.transaction.payment_method.payment_description = "Pago a tienda Plantas Pido";
    debugger
    try {
      
      const createdOrder = await this.checkoutService.createOrderTransaction(basket,
        this.checkoutForm, this.transaction);
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