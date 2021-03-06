export interface IMerchant {
    data: IDataMerchant;
}
  
export interface IDataMerchant {
    id: number;
    name: string;
    legal_name: string;
    legal_id: string;
    legal_id_type: string;
    phone_number: string;
    active: boolean;
    logo_url: string;
    email: string;
    contact_name: string;
    public_key: string;
    accepted_payment_methods: string[];
    accepted_currencies: string[];
    presigned_acceptance: IPresignedAcceptance;
}

export interface IPresignedAcceptance {
    acceptance_token: string;
    permalink: string;
    type: string;
}