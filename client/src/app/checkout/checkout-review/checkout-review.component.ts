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

  generatePresignedAcceptance(){
    return this.checkoutService.generatePresignedAcceptance().subscribe((response: any) => {
      this.appStepper.next();
    }, error => {
      console.log(error);
    })
  }

  createPaymentIntent(){
    this.appStepper.next();
    return this.basketService.createPaymentIntent().subscribe((response: any) => {
      this.toastr.success('Payment intent created');
      // this.appStepper.next();
    }, error => {
      console.log(error);
      
    });
  }

}