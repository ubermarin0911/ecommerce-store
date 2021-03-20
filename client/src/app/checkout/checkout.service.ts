import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { IDeliveryMethod } from '../shared/models/deliveryMethod';
import { IOrderToCreate } from '../shared/models/order';
import { BehaviorSubject, interval } from 'rxjs';
import { public_key } from 'wompi_keys/public_key';
import { IDataMerchant, IMerchant, IPresignedAcceptance } from '../shared/models/merchant';
import { ICreditCardData, Transaction } from '../shared/models/transaction';
import { IBasket } from '../shared/models/basket';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  baseUrl = environment.apiUrl;
  wompiUrl = environment.wompiUrl;

  private referenceOrderSource = new BehaviorSubject<string>(null);
  referenceOrder$ = this.referenceOrderSource.asObservable();

  constructor(private http: HttpClient) { }

  createTransaction(transaction: Transaction){
    return this.http.post(`${this.baseUrl}payments/transaction`, transaction);
  }

  async createOrderTransaction(transaction: Transaction) {
    return this.createOrder(transaction).toPromise();
  }

  createOrder(transaction: Transaction){
    return this.http.post(`${this.baseUrl}orders`, transaction);
  }

  async tokenizeCreditCard(creditCard: ICreditCardData){
    return this.http.post(`${this.wompiUrl}/tokens/cards`, creditCard).toPromise();
  }

  async getFinancialInstitutions(){
    return this.http.get(`${this.wompiUrl}/pse/financial_institutions`).toPromise();
  }

  pollingTransaction(transaction_id : string){
    return interval(1500).pipe(
      switchMap(() => this.http.get(`${this.wompiUrl}/transactions/${transaction_id}`)),
    )
  }


  getDeliveryMethods(){
    return this.http.get(`${this.baseUrl}orders/deliveryMethods`).pipe(
      map((dm: IDeliveryMethod[]) => {
        return dm.sort((a, b) => b.price - a.price);
      })
    );
  }

}
