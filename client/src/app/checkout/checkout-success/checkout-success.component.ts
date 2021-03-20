import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IOrder } from 'src/app/shared/models/order';
import { CheckoutService } from '../checkout.service';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-checkout-success',
  templateUrl: './checkout-success.component.html',
  styleUrls: ['./checkout-success.component.scss']
})
export class CheckoutSuccessComponent implements OnInit {
  order: IOrder;
  pollingRequest : Subscription;
  paymentStatusIcon = "fa-spinner fa-spin";
  titleResponse : string;
  descriptionResponse : string;
  orderStatus: string;

  constructor(private router: Router,
    private checkoutService: CheckoutService,
    private activatedRoute: ActivatedRoute) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation && navigation.extras && navigation.extras.state;
    if (state) {
      this.order = state as IOrder;
    }
   }

  ngOnInit() {
    this.pollingTransaction(this.activatedRoute.snapshot.queryParamMap.get('id'));
  }

  private pollingTransaction(transaction_id: string){
    this.pollingRequest = this.checkoutService.pollingTransaction(transaction_id).subscribe(
      (response:any) => {
        this.orderStatus = response.data.status;
        
        if(response.data.status !== "PENDING"){
          
          this.pollingRequest.unsubscribe();

          switch((response.data.status)) { 
            case "APPROVED": {
               this.paymentStatusIcon = "fa-check-circle green-color";
               this.titleResponse = "Gracias. Tu compra ha sido confirmada.";
               this.descriptionResponse = "En un plazo de 24 horas llevaremos el pedido a tu casa.";
               break; 
            } 
            case "DECLINED": { 
              this.paymentStatusIcon = "fa-times-circle red-color";
              this.titleResponse = "Lo sentimos. No pudimos procesar tu compra.";
              this.descriptionResponse = "Por favor, intenta nuevamente realizar el pago.";
              break; 
            } 
            case "VOIDED": { 
              this.paymentStatusIcon = "fa-ban red-color";
              this.titleResponse = "Transacción cancelada.";
              this.descriptionResponse = "La transacción fue cancelada. Intenta nuevamente.";
              break; 
           }
           case "ERROR": { 
              this.paymentStatusIcon = "fa-exclamation-circle red-color";
              this.titleResponse = "Lo sentimos. No pudimos procesar tu compra.";
              this.descriptionResponse = "Ocurrió un error al momento de realizar la compra. Por favor, intenta nuevamente.";
              break; 
           }
         } 
         
        }
      },
      error => console.log(error)
    );
  }
}