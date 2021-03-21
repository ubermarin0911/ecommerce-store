import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { IDeliveryMethod } from '../shared/models/deliveryMethod';
import { BehaviorSubject, interval, of } from 'rxjs';
import { ICreditCardData, Transaction } from '../shared/models/transaction';
import { IPresignedAcceptance } from '../shared/models/merchant';
import { IFinancialInstitution } from '../shared/models/financialInstitution';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  baseUrl = environment.apiUrl;
  wompiUrl = environment.wompiUrl;
  presignedAcceptance : IPresignedAcceptance;
  financialInstitutions : IFinancialInstitution;

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

  

  pollingTransaction(transaction_id : string){
    return interval(1500).pipe(
      switchMap(() => this.http.get(`${this.wompiUrl}/transactions/${transaction_id}`)),
    )
  }

  async getFinancialInstitutionsPromise(){
    return this.getFinancialInstitutions().toPromise();
  }

  async getPresignedAcceptancePromise(){
    return this.getPresignedAcceptance().toPromise();
  }

  getFinancialInstitutions(){
    if(this.financialInstitutions){
      return of(this.financialInstitutions);
    }

    return this.http.get<IFinancialInstitution>(`${this.wompiUrl}/pse/financial_institutions`).pipe(
      map(response => {
        this.financialInstitutions = response;

        return this.financialInstitutions;
      })
    );
  }

  getPresignedAcceptance(){
 
    if(this.presignedAcceptance){
      return of(this.presignedAcceptance);
    }

    return this.http.get<IPresignedAcceptance>(`${this.baseUrl}payments/presignedAcceptance`)
    .pipe(
      map(response => {
        this.presignedAcceptance = response;

        return this.presignedAcceptance;
      })
    );

  }

  getDeliveryMethods(){
    return this.http.get(`${this.baseUrl}orders/deliveryMethods`).pipe(
      map((dm: IDeliveryMethod[]) => {
        return dm.sort((a, b) => b.price - a.price);
      })
    );
  }
}
