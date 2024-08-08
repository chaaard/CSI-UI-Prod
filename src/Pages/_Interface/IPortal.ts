export default interface IPortal {
  Id: number
  CustomerId?: string | null
  TransactionDate?: Date | null
  OrderNo?: string | null
  NonMembershipFee?: number | null
  PurchasedAmount?: number | null
  Amount?: number | null
  Status?: string | null
  StoreName?: string | null
  DeleteFlag: boolean | null
}