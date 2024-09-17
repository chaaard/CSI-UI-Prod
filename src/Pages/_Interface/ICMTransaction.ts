import { ICustomerTransaction } from "./ICustomerTransaction";


export interface ICMTransaction extends ICustomerTransaction{
    modifiedDate?: Date;
    modifiedBy?: string;
    cmInvoice?: string;
    origInvoice?: string;
    referenceNo?: string;
    fileName?: string;
    generatedBy?: string;
    generatedDate?: Date;
    isDeleted?: boolean;

}