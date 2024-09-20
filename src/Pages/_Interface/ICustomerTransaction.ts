import { IBaseModel } from "./IBaseModel";

export interface ICustomerTransaction extends IBaseModel{
    CustomerName?: string;
    CustomerCode: string;
    TransactionDate: number;
    MembershipNo?: string;
    CashierNo?: string;
    RegisterNo: string;
    TransactionNo: string;
    JobOrderNo?: string;
    IsDeleted?: boolean;

}

export interface ICustomerInfoParams extends IBaseModel{
    CustomerName?: string;
    JobOrderNo?: string;
}