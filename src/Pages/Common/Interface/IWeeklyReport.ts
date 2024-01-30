export default interface IWeeklyReport
{
  [key: string]: any; 
  LocationName?: string,
  TransactionDate?: Date, 
  MembershipNo?: string,
  RegisterNo?: string,
  TransactionNo?: string,
  OrderNo?: string,
  Qty?: number,
  Amount?: number,
  SubTotal?: number,
  Member?: number,
  NonMember?: number,
  OriginalAmout?: number,
  AccountsPayment?: string,
  APTRX?: string,
  TotalBilled?: number,
}