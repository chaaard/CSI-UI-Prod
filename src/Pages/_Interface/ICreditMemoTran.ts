import IVarianceMMS from "./IVarianceMMS";
import { ICustomerTransaction } from "./ICustomerTransaction";
import { Dayjs } from "dayjs";

export interface ICreditMemoTran{
    Variance?: IVarianceMMS;
    CMTranList?: ICustomerTransaction[];
}

export interface ICreditMemoDto{
    Id?: string;
    CMTranList?: ICustomerTransaction[];
    SelectedDate?: string;
    Club: number;
    FilePath?: string;
}

export interface ICreditMemoInvoiceDto {
    UserId?: string; 
    Dates?: string[];
    MerchantCode?: string[];
    StoreId?: number[];
    Action?: string;
}