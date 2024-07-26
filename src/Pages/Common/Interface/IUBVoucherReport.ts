export default interface IUBVoucherReport
{
  [Id: number]: any; 
  LocationId?: string,
  TransactionDate?: Date, 
  OrderNo?: string,
  TransactionNo?: string,
  SKU?: string,
  Description?: string,
  SRP: number,
  UnionBank: number,
  KMC: number,
}