import { CdkStepper } from '@angular/cdk/stepper';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BasketService } from 'src/app/basket/basket.service';
import { PaymentMethod } from 'src/app/shared/enums/paymentMethods';
import { SelectOption } from 'src/app/shared/models/selectOption';
import { Transaction } from 'src/app/shared/models/transaction';
import { CheckoutService } from '../../checkout.service';
import { Subscription } from 'rxjs';
import { IFinancialInstitution } from '../../../shared/models/financialInstitution';

@Component({
  selector: 'app-payment-pse',
  templateUrl: './payment-pse.component.html',
  styleUrls: ['./payment-pse.component.scss']
})
export class PaymentPseComponent implements OnInit {
  @Input() checkoutForm: FormGroup;
  @Input() appStepper: CdkStepper;

  pseForm: FormGroup;

  optionsUserType: SelectOption[] = [];
  optionsLegalIdType: SelectOption[] = [];
  optionsFinancialInstitutionCodes: SelectOption[] = [];
  pollingRequest : Subscription;

  transaction: Transaction = new Transaction();
  policyPrivacy: string;
  financialInstitutions : IFinancialInstitution;

  constructor(private checkoutService: CheckoutService,
    private basketService: BasketService) { }

  ngOnInit(): void {
    this.checkoutService.getPresignedAcceptance().subscribe(data => {
      this.policyPrivacy = data.permalink;
    }, error => console.log(error));
    this.initOptions();
    this.createPseForm();
  }
  
  createPseForm(){
    this.pseForm = new FormGroup({
      userType: new FormControl(0, Validators.required),
      legalIdType: new FormControl('', Validators.required),
      legalId: new FormControl('', Validators.required), 
      institutionCode: new FormControl('', Validators.required),
      paymentDescription:  new FormControl('', Validators.required),
    });
  }

  async initOptions(){
    this.optionsUserType.push(new SelectOption(0, "Persona natural"));
    this.optionsUserType.push(new SelectOption(1, "Persona jurídica"));

    this.optionsLegalIdType.push(new SelectOption("CC", "Cédula de ciudadanía"));
    this.optionsLegalIdType.push(new SelectOption("NIT", "NIT"));

    try{
      this.financialInstitutions = await this.checkoutService.getFinancialInstitutionsPromise();
    }catch(error){
      console.log(error);
    }
    
    for (let institution of this.financialInstitutions.data) {
      this.optionsFinancialInstitutionCodes.push(
        new SelectOption(institution.financial_institution_code, 
                         institution.financial_institution_name));
    }
  }

  async submitOrder(){
    const paymentMethod = PaymentMethod;
    
    const basket = this.basketService.getCurrentBasketValue();

    this.transaction.payment_method = {
      type : paymentMethod.Pse,
      user_type : this.pseForm.get('userType').value || "0",
      user_legal_id_type: this.pseForm.get('legalIdType').value || "CC",
      user_legal_id: this.pseForm.get('legalId').value,
      financial_institution_code: this.pseForm.get('institutionCode').value,
      payment_description : "Pago a tienda Plantas Pido"
    }

    this.transaction.shipping_address = this.checkoutForm.get('addressForm').value;
    this.transaction.basketId = basket.id;
    
    try {
      
      const createdOrder : any = await this.checkoutService.createOrderTransaction(this.transaction);
      this.pollingTransaction(createdOrder.transactionId);

      // console.log(createdOrder);
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