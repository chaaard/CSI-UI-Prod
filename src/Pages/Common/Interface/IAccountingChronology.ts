export default interface IAccountingChronology {
  Id: number
  MatchId: number,
  AdjustmentId: number,
  CustomerId?: string | null
  TransactionDate?: Date | null
  OrderNo?: string | null
  NonMembershipFee?: number | null
  PurchasedAmount?: number | null
  Amount?: number | null
  Status?: string | null
  StoreName?: string | null
  FileName?: string | null
  DeleteFlag: boolean | null
}