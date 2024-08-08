export default interface ILogDetails {
  Id?: number
  CustomerId?: string
  LocationId?: number
  TransactionDate?: string
  MembershipNo?: string
  CashierNo?: string
  RegisterNo?: string
  TransactionNo?: string
  OrderNo?: string
  Qty?: number
  Amount?: number
  SubTotal?: number
  UserId?: string
  StatusId?: number
  IsUpload: boolean
  IsGenerate: boolean
  IsTransfer: boolean
  DeleteFlag: boolean
  InvoiceNo?: string
}