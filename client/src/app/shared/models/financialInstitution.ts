export interface IFinancialInstitution {
    data: Data[];
}

interface Data{
    financial_institution_code: string;
    financial_institution_name: string;
}