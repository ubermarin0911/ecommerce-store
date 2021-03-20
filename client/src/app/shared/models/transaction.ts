import { environment } from "src/environments/environment";
import { IAddress } from "./address";

export interface ITransaction {
    id?: string;
    created_at?: string;
    status?: string;
    payment_method_type?: string;
    payment_link_id?: any;
    basketId?: string;
    shipToAddress?: IAddress;
    
    acceptance_token: string;
    amount_in_cents: number;
    currency: string;
    customer_email: string;
    reference: string;
    payment_method: any;
    redirect_url: string;
    customer_data?: ICustomerData;
    shipping_address?: IShippingAddress;
}
  
export interface IShippingAddress {
    address_line_1?: string;
    city?: string;
    name?: string;
    phone_number?: string;
}
  
export interface ICustomerData {
    phone_number: string;
    full_name: string;
}
  

export class Transaction implements ITransaction{
    acceptance_token: string = "";
    amount_in_cents: number = 0;
    currency: string = "";
    customer_email: string = "";
    reference: string = "";
    redirect_url: string = `${environment.clientUrl}checkout/pedido`;

    basketId: string = "";
    payment_method: any = {};
    shipping_address: IShippingAddress;
    customer_data: ICustomerData;

    constructor(){
        this.shipping_address = new ShippingAddress();
        this.customer_data = new CustomerData();
    }
}

export class CustomerData implements ICustomerData{
    phone_number: string = "";
    full_name: string = "";
}

export class ShippingAddress implements IShippingAddress{
    address_line_1: string = "";
    city: string = "";
    name: string = "";
    phone_number: string = "";
}

export interface ICreditCardData {
    number: string;
    cvc: string;
    exp_month: string;
    exp_year: string;
    card_holder: string;
}