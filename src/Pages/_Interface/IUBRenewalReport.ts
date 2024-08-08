export default interface IUBRenewalReport
{
  Ids:string,
  LocationId?: string,
  AutoChargeDate: string, 
  Gold?: number,
  Amount700: number,
  Business?: number,
  Amount900: number,
  AddOnFree?: number,
  TotalAmount: number,
  CSINo: string,
  TransactedDate: Date,
}