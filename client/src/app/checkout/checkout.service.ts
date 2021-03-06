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

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  baseUrl = environment.apiUrl;

  private acceptanceTokenSource = new BehaviorSubject<IPresignedAcceptance>(null);
  acceptanceToken$ = this.acceptanceTokenSource.asObservable();

  private referenceOrderSource = new BehaviorSubject<string>(null);
  referenceOrder$ = this.referenceOrderSource.asObservable();

  constructor(private http: HttpClient) { }

  generatePresignedAcceptance(){
    return this.http.get(`${this.baseUrl}payments/presignedAcceptance`).pipe(
      map((presignedAcceptance: IPresignedAcceptance) => {
       this.acceptanceTokenSource.next(presignedAcceptance);
      })
    );
  }

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

  createOrder(order: IOrderToCreate){
    return this.http.post(`${this.baseUrl}orders`,order);
  }
  
  getCurrentAcceptanceTokenValue(){
    return this.acceptanceTokenSource.value;
  }

  getDeliveryMethods(){
    return this.http.get(`${this.baseUrl}orders/deliveryMethods`).pipe(
      map((dm: IDeliveryMethod[]) => {
        return dm.sort((a, b) => b.price - a.price);
      })
    );
  }

}
