export default interface IAccountingProoflist {
  Id: number
  CustomerId?: string | null
  TransactionDate?: Date | null
  OrderNo?: string | null
  NonMembershipFee?: number | null
  PurchasedAmount?: number | null
  Amount?: number | null
  Status?: string | null
  StoreName?: string | null
  FileDescriptionId?: number | null
  DeleteFlag: boolean | null
}