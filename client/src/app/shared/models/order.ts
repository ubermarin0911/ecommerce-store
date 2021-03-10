import { IAddress } from './address';
import { IShippingAddress } from './transaction';

export interface IOrderToCreate {
    basketId: string;
    shipToAddress: IShippingAddress;
}

export interface IOrder {
    id: number;
    buyerEmail: string;
    orderDate: string;
    shipToAddress: IAddress;
    deliveryMethod: string;
    shippingPrice: number;
    orderItems: IOrderItem[];
    subtotal: number;
    total: number;
    status: string;
}
  
export interface IOrderItem {
    productId: number;
    productName: string;
    pictureUrl: string;
    price: number;
    quantity: number;
}