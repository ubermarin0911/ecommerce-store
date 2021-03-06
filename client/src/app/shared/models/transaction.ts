export interface ITransaction {
    acceptance_token: string;
    amount_in_cents: number;
    currency: string;
    customer_email: string;
    reference: string;
    payment_method: IPaymentMethod;
    redirect_url?: string;
    customer_data?: ICustomerData;
    shipping_address?: IShippingAddress;
}
  
export interface IShippingAddress {
    address_line_1: string;
    address_line_2: string;
    country: string;
    region: string;
    city: string;
    name: string;
    phone_number: string;
    postal_code: string;
}
  
export interface ICustomerData {
    phone_number: string;
    full_name: string;
}
  
export interface IPaymentMethod {
    type: string;
    token?: string;
    installments?: number;
    phone_number?: string;
}

export class Transaction implements ITransaction{
    acceptance_token: string = "";
    amount_in_cents: number = 0;
    currency: string = "";
    customer_email: string = "";
    reference: string = "";
    payment_method: IPaymentMethod;
    shipping_address: IShippingAddress;
    customer_data: ICustomerData;

    constructor(){
        this.payment_method = new PaymentMethod();
        this.shipping_address = new ShippingAddress();
        this.customer_data = new CustomerData();
    }
}

export class PaymentMethod implements IPaymentMethod{
    type: string = "";
    token?: string = "";
    installments?: number = 1;
    phone_number?: string = "";
}

export class CustomerData implements ICustomerData{
    phone_number: string = "";
    full_name: string = "";
}

export class ShippingAddress implements IShippingAddress{
    address_line_1: string = "";
    address_line_2: string = "";
    country: string = "";
    region: string = "";
    city: string = "";
    name: string = "";
    phone_number: string = "";
    postal_code: string = "";

}