export default interface IAccountingProoflistAdjustments {
  Id: number
  CustomerId?: string
  TransactionDate?: Date
  OrderNo?: string
  NonMembershipFee?: number
  PurchasedAmount?: number
  Amount?: number
  Status?: number
  StoreName?: string
  FileDescriptionId?: number
  Category?: string
  Descriptions?: string
  DeleteFlag: boolean
}