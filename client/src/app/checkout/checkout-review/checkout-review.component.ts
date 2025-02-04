import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IBasket } from 'src/app/shared/models/basket';
import { BasketService } from 'src/app/basket/basket.service';
import { ToastrService } from 'ngx-toastr';
import { CdkStepper } from '@angular/cdk/stepper';
import { CheckoutService } from '../checkout.service';

@Component({
  selector: 'app-checkout-review',
  templateUrl: './checkout-review.component.html',
  styleUrls: ['./checkout-review.component.scss']
})
export class CheckoutReviewComponent implements OnInit {
  @Input() appStepper: CdkStepper;
  basket$: Observable<IBasket>;
  

  constructor(private basketService: BasketService, 
    private checkoutService: CheckoutService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.basket$ = this.basketService.basket$;
  }

  async getPresignedAcceptance(){

    try{
      await this.checkoutService.getFinancialInstitutionsPromise();
      await this.checkoutService.getPresignedAcceptancePromise();
      this.appStepper.next();
    }catch (error) {
      console.log(error);
    }
    
  }
}