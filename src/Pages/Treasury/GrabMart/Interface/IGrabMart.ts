export default interface IGrabMart {
  Id: number
  CustomerId?: string
  LocationName?: string
  TransactionDate?: Date
  MembershipNo?: string
  CashierNo?: string
  RegisterNo?: string
  TransactionNo?: string
  OrderNo?: string
  Qty?: number
  Amount?: number
  UserId?: string
  DeleteFlag: boolean
}
