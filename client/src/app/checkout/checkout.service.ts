import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { IDeliveryMethod } from '../shared/models/deliveryMethod';
import { IOrderToCreate } from '../shared/models/order';
import { BehaviorSubject } from 'rxjs';
import { public_key } from 'wompi_keys/public_key';
import { IDataMerchant, IMerchant, IPresignedAcceptance } from '../shared/models/merchant';
import { Transaction } from '../shared/models/transaction';
import { IBasket } from '../shared/models/basket';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  baseUrl = environment.apiUrl;

  private referenceOrderSource = new BehaviorSubject<string>(null);
  referenceOrder$ = this.referenceOrderSource.asObservable();

  constructor(private http: HttpClient) { }

  createTransaction(transaction: Transaction){
    return this.http.post(`${this.baseUrl}payments/transaction`, transaction);
  }

  generateReferenceOrder(){
    return this.http.get(`${this.baseUrl}payments/referenceOrder`).pipe(
      map((reference: string) => {
       this.referenceOrderSource.next(reference);
      })
    );
  }

  createOrder(transaction: Transaction){
    return this.http.post(`${this.baseUrl}orders`, transaction);
  }

  getDeliveryMethods(){
    return this.http.get(`${this.baseUrl}orders/deliveryMethods`).pipe(
      map((dm: IDeliveryMethod[]) => {
        return dm.sort((a, b) => b.price - a.price);
      })
    );
  }

  async createOrderTransaction(basket: IBasket, checkoutForm: FormGroup, transaction: Transaction) {
    const orderToCreate = this.getOrderToCreate(basket, checkoutForm);

    transaction.basketId = orderToCreate.basketId;
    transaction.shipping_address = orderToCreate.shipToAddress;

    return this.createOrder(transaction).toPromise();
  }

  getOrderToCreate(basket: IBasket, checkoutForm: FormGroup) {
    return {
       basketId: basket.id,
       shipToAddress: checkoutForm.get('addressForm').value
    };
  }

}
